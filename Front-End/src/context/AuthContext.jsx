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
          } else if (!dbError && !dbUser) {
            // Si el usuario aún no está en la tabla, insertarlo automáticamente
            const newUser = {
              id: user.id,
              email: user.email,
              nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
              puntos: 50,
              tokens: 0,
              racha: 1,
              mascota: user.user_metadata?.mascota || 'suma',
            };
            const { data: inserted, error: insertError } = await supabase
              .from('Usuario')
              .insert([newUser])
              .select()
              .maybeSingle();

            if (!insertError && inserted) {
              data = inserted;
            }
          }
        } catch (supabaseErr) {
          console.warn("⚠️ Consulta directa a tabla Supabase omitida:", supabaseErr);
        }
      }

      // 2. Si no obtuvimos datos directos, consultar al backend si está disponible
      if (!data) {
        try {
          const response = await api.post("/usuarios/registro", {
            uid: user.id,
            email: user.email,
            nombre: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario",
          });
          data = response?.data;
        } catch (apiErr) {
          console.warn("⚠️ Back-End API no disponible, usando datos de la sesión de Supabase:", apiErr.message);
        }
      }

      // 3. Fallback garantizado: armar perfil desde los metadatos de la sesión
      if (!data) {
        data = {
          id: user.id,
          nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Usuario",
          email: user.email,
          puntos: 0,
          tokens: 0,
          racha: 1,
          edad: user.user_metadata?.edad || "",
          desafio: user.user_metadata?.desafio || "",
          mascota: user.user_metadata?.mascota || "suma",
          onboardingCompleto: Boolean(user.user_metadata?.desafio),
          rol: "usuario",
        };
      }

      const normalizedProfile = {
        ...data,
        mascota: normalizeMascot(data.mascota),
      };

      setProfile(normalizedProfile);
      lastFetchedId.current = user.id;
      setProfileError(null);

      const hasOnboardingData =
        Boolean(data.desafio && String(data.desafio).trim() !== "" && data.onboardingCompleto !== false);

      const isNew = !hasOnboardingData;
      setIsNewUser(isNew);

      console.log(`👤 Perfil cargado: ${data.nombre} (Nuevo: ${isNew ? 'SÍ' : 'NO'})`);
    } catch (error) {
      console.error("🔴 Error al procesar perfil:", error);
      const safeProfile = {
        id: user.id,
        nombre: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario",
        email: user.email,
        puntos: 0,
        racha: 1,
        mascota: "suma",
        onboardingCompleto: false,
        rol: "usuario",
      };
      setProfile(safeProfile);
      setIsNewUser(true);
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

  const completeOnboarding = useCallback(async (additionalData = {}) => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const { data } = await api.put(`/usuarios/${session.user.id}`, {
        ...additionalData,
        onboardingCompleto: true,
      });

      if (data) {
        setProfile(data);
        setIsNewUser(false);
        console.log('✅ Onboarding completado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error al completar onboarding:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

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
      const newProfile = {
        ...(profile || {}),
        ...updatedData,
        mascota: updatedData.mascota ? normalizeMascot(updatedData.mascota) : (profile?.mascota || 'suma'),
      };

      setProfile(newProfile);
      localStorage.setItem("mate_demo_profile", JSON.stringify(newProfile));

      if (session?.user?.id && session.user.id !== 'demo-adult-user-01') {
        try {
          await api.put(`/usuarios/${session.user.id}`, updatedData);
        } catch (apiErr) {
          console.warn("No se pudo sincronizar perfil con backend (usando persistencia local):", apiErr);
        }
      }
      return newProfile;
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      throw err;
    }
  }, [profile, session]);

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