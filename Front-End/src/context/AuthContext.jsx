/* eslint-disable react-hooks/preserve-manual-memoization */
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import api from '../config/api';
import { MASCOT_LIST } from '../mascotas';

const AuthContext = createContext(undefined);

const DEFAULT_MASCOT = 'multi';

const normalizeMascot = (mascotId) => {
  if (typeof mascotId !== 'string') return DEFAULT_MASCOT;

  const normalized = mascotId.trim().toLowerCase();
  return MASCOT_LIST.includes(normalized) ? normalized : DEFAULT_MASCOT;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const lastFetchedId = useRef(null);
  const isFetching = useRef(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const initializationAttempted = useRef(false); // ✅ Evita múltiples inicializaciones

  const logout = useCallback(async () => {
    // Limpieza optimista para evitar mostrar el loader global de inicio de sesión.
    setSession(null);
    setProfile(null);
    setIsNewUser(false);
    lastFetchedId.current = null;
    setLoading(false);
    setInitialized(true);

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("⚠️ Error al cerrar sesión en Supabase, limpiando estado local.", err);
    }
  }, []);

  const fetchProfile = useCallback(async (user, options = {}) => {
    const { force = false } = options;

    if (!user?.id || isFetching.current) return;

    if (!force && profile?.id === user.id && lastFetchedId.current === user.id) {
      console.log(`✅ Perfil ya cargado para ${user.id}`);
      return;
    }

    isFetching.current = true;
    setProfileError(null);
    try {
      console.log(`🔄 Obteniendo perfil para: ${user.id}`);

      const localOnboardingDone = localStorage.getItem(`mate_onboarding_done_${user.id}`) === "true";
      let cachedProfile = null;
      try {
        const cachedRaw = localStorage.getItem(`mate_profile_${user.id}`);
        if (cachedRaw) cachedProfile = JSON.parse(cachedRaw);
      } catch (e) {
        // Ignorar error de parsing
      }

      let data = null;

      // 1. Intentar consultar directamente la tabla Usuario en Supabase
      if (supabase && typeof supabase.from === 'function') {
        try {
          const { data: dbUser, error: dbError } = await supabase
            .from('Usuario')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (!dbError && dbUser) {
            data = dbUser;
          }
        } catch (supabaseErr) {
          console.warn("⚠️ Consulta directa a tabla Supabase omitida:", supabaseErr);
        }
      }

      // 2. Si no obtuvimos datos de la tabla, intentar consultar al backend API
      if (!data) {
        try {
          const response = await api.post("/usuarios/registro", {
            uid: user.id,
            email: user.email,
            nombre: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario",
          });
          data = response?.data;
        } catch (apiErr) {
          console.warn("⚠️ Back-End API no disponible, resolviendo desde sesión de Supabase:", apiErr.message);
        }
      }

      // 3. Fusionar datos de Supabase DB, Auth user_metadata y caché local
      const userMeta = user.user_metadata || {};
      const resolvedDesafio = data?.desafio || userMeta.desafio || cachedProfile?.desafio || "";
      const resolvedEdad = data?.edad || userMeta.edad || cachedProfile?.edad || "";
      const resolvedMascota = normalizeMascot(data?.mascota || userMeta.mascota || cachedProfile?.mascota || "suma");
      const resolvedNombre = data?.nombre || userMeta.full_name || userMeta.name || cachedProfile?.nombre || user.email?.split("@")[0] || "Usuario";

      const isOnboardingComplete = Boolean(
        localOnboardingDone ||
        data?.onboardingCompleto === true ||
        userMeta.onboardingCompleto === true ||
        (resolvedDesafio && resolvedDesafio.trim() !== "")
      );

      const normalizedProfile = {
        id: user.id,
        email: user.email,
        nombre: resolvedNombre,
        puntos: Number(data?.puntos ?? cachedProfile?.puntos ?? 50),
        tokens: Number(data?.tokens ?? cachedProfile?.tokens ?? 10),
        racha: Number(data?.racha ?? cachedProfile?.racha ?? 1),
        edad: resolvedEdad,
        desafio: resolvedDesafio,
        mascota: resolvedMascota,
        genero: data?.genero || userMeta.genero || cachedProfile?.genero || "No especificado",
        sentimiento: data?.sentimiento || userMeta.tiempo || cachedProfile?.sentimiento || "10 minutos",
        onboardingCompleto: isOnboardingComplete,
        rol: data?.rol || "usuario",
      };

      setProfile(normalizedProfile);
      lastFetchedId.current = user.id;
      setProfileError(null);

      const isNew = !isOnboardingComplete;
      setIsNewUser(isNew);

      if (isOnboardingComplete) {
        localStorage.setItem(`mate_onboarding_done_${user.id}`, "true");
        localStorage.setItem(`mate_profile_${user.id}`, JSON.stringify(normalizedProfile));
      }

      console.log(`👤 Perfil cargado: ${normalizedProfile.nombre} (Requiere Onboarding: ${isNew ? 'SÍ' : 'NO'})`);
    } catch (error) {
      console.error("🔴 Error al procesar perfil:", error);
      const safeProfile = {
        id: user.id,
        nombre: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario",
        email: user.email,
        puntos: 50,
        racha: 1,
        mascota: "suma",
        onboardingCompleto: true,
        rol: "usuario",
      };
      setProfile(safeProfile);
      setIsNewUser(false);
      lastFetchedId.current = user.id;
    } finally {
      isFetching.current = false;
    }
  }, [profile?.id, logout]);

  // ✅ Función para marcar como inicializado
  const markInitialized = useCallback(() => {
    if (!initialized) {
      console.log('✅ Auth inicializado correctamente');
      setInitialized(true);
      setLoading(false);
    }
  }, [initialized]);

  // ✅ Efecto de inicialización mejorado - SIN TIMEOUT AGRESIVO
  useEffect(() => {
    // ✅ Evitar múltiples inicializaciones
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Verificando sesión en Supabase...');
        
        // 🧪 Chequear primero si hay sesión de demo guardada localmente
        const savedDemo = localStorage.getItem("mate_demo_profile");
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            const demoUser = {
              id: parsed.id || "demo-adult-user-01",
              email: parsed.email || "maria.adulta@matemas.com",
              user_metadata: { full_name: parsed.nombre || "María Gómez" }
            };
            const demoSession = { user: demoUser, access_token: "demo-token-12345" };
            setSession(demoSession);
            setProfile(parsed);
            setIsNewUser(false);
            lastFetchedId.current = demoUser.id;
            setInitialized(true);
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error al parsear demo profile", e);
          }
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn("⚠️ Error al obtener sesión:", error);
        }

        if (currentSession?.user) {
          console.log("✅ Sesión existente encontrada");
          setSession(currentSession);
          await fetchProfile(currentSession.user);
        } else {
          console.log("ℹ️ No hay sesión activa");
          setSession(null);
          setProfile(null);
          setIsNewUser(false);
        }
      } catch (error) {
        console.error("🔴 Error en inicialización:", error);
        setSession(null);
        setProfile(null);
        setIsNewUser(false);
      } finally {
        if (isMounted) {
          markInitialized();
        }
      }
    };

    initializeAuth();

    // ✅ Suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log(`🔐 AuthEvent: ${_event}`);

      if (!isMounted) return;

      // ✅ IMPORTANTE: Si el evento es SIGNED_IN, esperar a que se cargue el perfil
      if (_event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔄 Usuario ha iniciado sesión, verificando onboarding...');
        setSession(newSession);
        // Forzar la obtención del perfil
        lastFetchedId.current = null;
        fetchProfile(newSession.user).then(() => {
          // Asegurar que el estado esté actualizado
          if (!initialized) {
            markInitialized();
          }
        });
        return;
      }

      if (_event === 'USER_UPDATED' && newSession?.user) {
        console.log('🔄 Usuario actualizado, refrescando perfil...');
        if (lastFetchedId.current === newSession.user.id) {
          fetchProfile(newSession.user);
        }
        return;
      }

      if (_event === 'SIGNED_OUT') {
        console.log('🚪 Usuario cerró sesión');
        setSession(null);
        setProfile(null);
        setIsNewUser(false);
        lastFetchedId.current = null;
        // ✅ Asegurar que se marque como inicializado después del logout
        if (!initialized) {
          markInitialized();
        }
        return;
      }

      // Manejo genérico para otros eventos
      setSession(newSession || null);

      if (newSession?.user) {
        if (lastFetchedId.current !== newSession.user.id) {
          lastFetchedId.current = newSession.user.id;
          fetchProfile(newSession.user);
        }
      } else {
        setProfile(null);
        setIsNewUser(false);
        lastFetchedId.current = null;
      }

      if (!initialized) {
        markInitialized();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, markInitialized, initialized]);

  // completeOnboarding is declared below using updateProfile

  const login = useCallback(async (email, password, options = {}) => {
    const { rememberMe = true } = options;
    // No tocar loading global: desmontaría /login y borraría el formulario (BUG-001).
    try {
      if (rememberMe) {
        sessionStorage.removeItem("mate_auth_ephemeral");
      } else {
        sessionStorage.setItem("mate_auth_ephemeral", "1");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const isCredentialError =
          error.status === 400 ||
          error.status === 401 ||
          error.code === "invalid_credentials" ||
          /invalid login|invalid_credentials|email not confirmed/i.test(
            error.message || "",
          );
        if (isCredentialError) throw error;
        throw new Error("SUPABASE_UNAVAILABLE");
      }

      // Asegura estado de sesión local inmediatamente para que los guards redirijan.
      if (data?.session) {
        setSession(data.session);
      } else if (data?.user) {
        setSession((prev) => prev ?? { user: data.user, access_token: null });
      }

      if (data.user) {
        lastFetchedId.current = null;
        await fetchProfile(data.user);
      }
      return data;
    } catch (err) {
      const isMockMode = !import.meta.env.VITE_SUPABASE_URL ||
        import.meta.env.VITE_SUPABASE_URL.includes("[TU_PROYECTO]");

      // Solo en mock local: nunca usar /usuarios/login + dev-bypass en producción.
      if (isMockMode && err.message === "SUPABASE_UNAVAILABLE") {
        console.warn("⚠️ Usando autenticación de respaldo (Back-End Mock local)");
        const response = await api.post("/usuarios/login", { email, password });
        if (response.data) {
          const mockSession = {
            user: { email, id: response.data.user?.id || "local-auth" },
            access_token: response.data.user?.token || "local-mock-token",
          };
          setSession(mockSession);
          if (mockSession.user) {
            lastFetchedId.current = null;
            await fetchProfile(mockSession.user);
          }
        }
        return response.data;
      }
      throw err;
    }
  }, [fetchProfile]);

  const register = useCallback(async (email, password, nombre, extraData = {}) => {
    try {
      setRegisterLoading(true);
      
      const redirectUrl = "https://matemas.vercel.app/auth/callback";
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nombre, ...extraData },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      setRegisterLoading(false);
      return data;
    } catch (err) {
      setRegisterLoading(false);
      
      if (err.message === "SUPABASE_UNAVAILABLE_MOCK" || err.status === 400) {
        console.warn("⚠️ Supabase no disponible. Modo de autenticación local");
        const response = await api.post("/usuarios/registro", {
          uid: "mock-" + Date.now(),
          email,
          password,
          nombre,
          ...extraData,
        });
        if (response.data) {
          const mockSession = {
            user: { email, id: "local-auth" },
            access_token: "local-mock-token",
          };
          setSession(mockSession);
          if (mockSession.user) {
            lastFetchedId.current = null;
            await fetchProfile(mockSession.user);
          }
        }
        return response.data;
      }
      throw err;
    }
  }, [fetchProfile]);

  const loginWithGoogle = useCallback(async (redirectTo) => {
    try {
      setGoogleLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setGoogleLoading(false);
      throw err;
    }
  }, []);

  const loginAsDemoUser = useCallback(async () => {
    const demoUser = {
      id: "demo-adult-user-01",
      email: "maria.adulta@matemas.com",
      user_metadata: { full_name: "María Gómez", mascota: "suma" }
    };
    const demoProfile = {
      id: "demo-adult-user-01",
      nombre: "María Gómez",
      email: "maria.adulta@matemas.com",
      puntos: 450,
      racha: 7,
      edad: "38",
      desafio: "mejorar_calculo_diario",
      genero: "femenino",
      sentimiento: "motivado",
      mascota: "suma",
      isNew: false,
      onboardingCompleto: true,
      rol: "user"
    };

    const demoSession = {
      user: demoUser,
      access_token: "demo-token-12345",
    };

    if (supabase?._updateMockSession) {
      supabase._updateMockSession(demoSession);
    }
    localStorage.setItem("supabase.mock.session", JSON.stringify(demoSession));
    localStorage.setItem("mate_demo_profile", JSON.stringify(demoProfile));

    setSession(demoSession);
    setProfile(demoProfile);
    setIsNewUser(false);
    lastFetchedId.current = demoUser.id;
    setProfileError(null);
    setLoading(false);
    setInitialized(true);
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    try {
      const normalizedMascotVal = updatedData.mascota
        ? normalizeMascot(updatedData.mascota)
        : (profile?.mascota || 'suma');

      const newProfile = {
        ...(profile || {}),
        ...updatedData,
        mascota: normalizedMascotVal,
        onboardingCompleto: true,
      };

      setProfile(newProfile);
      setIsNewUser(false);

      const userId = session?.user?.id || profile?.id;
      if (userId) {
        localStorage.setItem(`mate_onboarding_done_${userId}`, "true");
        localStorage.setItem(`mate_profile_${userId}`, JSON.stringify(newProfile));
      }
      localStorage.setItem("mate_demo_profile", JSON.stringify(newProfile));

      if (session?.user?.id && session.user.id !== 'demo-adult-user-01') {
        // 1. Guardar en metadatos de Supabase Auth (persistencia nativa indestructible)
        try {
          if (supabase?.auth?.updateUser) {
            await supabase.auth.updateUser({
              data: {
                full_name: newProfile.nombre,
                edad: String(newProfile.edad || ''),
                desafio: String(newProfile.desafio || ''),
                mascota: normalizedMascotVal,
                genero: newProfile.genero || 'No especificado',
                tiempo: newProfile.tiempo || '10 minutos',
                onboardingCompleto: true,
              }
            });
            console.log("✅ Metadatos de usuario guardados en Supabase Auth");
          }
        } catch (authErr) {
          console.warn("⚠️ Error actualizando user_metadata en Supabase:", authErr);
        }

        // 2. Guardar directamente en la tabla Usuario de Supabase
        if (supabase && typeof supabase.from === 'function') {
          try {
            const { error: supaErr } = await supabase.from('Usuario').upsert({
              id: session.user.id,
              email: session.user.email,
              nombre: newProfile.nombre || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              edad: String(newProfile.edad || ''),
              desafio: String(newProfile.desafio || ''),
              mascota: normalizedMascotVal,
              genero: newProfile.genero || 'No especificado',
              sentimiento: newProfile.tiempo || newProfile.sentimiento || '10 minutos',
              puntos: Number(newProfile.puntos ?? 50),
              tokens: Number(newProfile.tokens ?? 10),
              racha: Number(newProfile.racha ?? 1),
            });
            if (supaErr) {
              console.warn("⚠️ Upsert en tabla Usuario:", supaErr.message);
            } else {
              console.log("✅ Perfil guardado directamente en Supabase DB");
            }
          } catch (supaErr) {
            console.warn("⚠️ Error guardando en Supabase:", supaErr);
          }
        }

        // 3. Intentar sincronizar con backend si existiera
        try {
          await api.put(`/usuarios/${session.user.id}`, {
            ...updatedData,
            onboardingCompleto: true,
          });
        } catch (apiErr) {
          // Omitir si no hay backend
        }
      }
      return newProfile;
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      throw err;
    }
  }, [profile, session]);

  const completeOnboarding = useCallback(async (additionalData = {}) => {
    return await updateProfile({
      ...additionalData,
      onboardingCompleto: true,
    });
  }, [updateProfile]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      profile,
      token: session?.access_token ?? null,
      isAuthenticated: !!session,
      isNewUser,
      loading,
      registerLoading,
      googleLoading,
      initialized,
      profileError,
      login,
      loginAsDemoUser,
      updateProfile,
      setProfile,
      register,
      logout: async () => {
        localStorage.removeItem("mate_demo_profile");
        localStorage.removeItem("supabase.mock.session");
        await logout();
      },
      loginWithGoogle,
      completeOnboarding,
      refreshProfile: () => session?.user && fetchProfile(session.user, { force: true }),
      shouldShowOnboarding: isNewUser && !!session && !!profile,
      shouldShowDashboard: !isNewUser && !!session && !!profile,
      shouldShowLogin: !session && initialized && !loading,
    }),
    [session, profile, isNewUser, loading, registerLoading, googleLoading, initialized, profileError,
      login, loginAsDemoUser, updateProfile, register, logout, loginWithGoogle, completeOnboarding, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};