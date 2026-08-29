import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";//
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";//

import { useAuth } from "../context/AuthContext";
// Lazy imports — se cargan solo cuando se visitan
const Register = lazy(() => import("../pages/Register"));
const Landing = lazy(() => import("../pages/Landing.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const NotFound = lazy(() => import("../pages/NotFound"));
const LoginPage = lazy(() => import("../pages/Login"));
const ConsolaAdmin = lazy(() => import("../pages/ConsolaAdmin"));
const StartedPage = lazy(() => import("../pages/Started.jsx"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Nosotros = lazy(() => import("../pages/Nosotros.jsx"));
const Desafios = lazy(() => import("../pages/Desafios.jsx"));
const AuthCallback = lazy(() => import("../pages/AuthCallback.jsx"));
const ModuloEjercicios = lazy(() => import("../pages/Ejercicios.jsx"));
const DragConstraints = lazy(() => import("../components/layouts/Ejercicios/DropAndDown.jsx"));
const TermsOfService = lazy(() => import("../pages/TermsOfService.jsx"));
const MixtoPage = lazy(() => import("../pages/Mixto.jsx"));
const RankingPage = lazy(() => import("../pages/Ranking.jsx"));
const Configuracion = lazy(() => import("../components/layouts/Configuracion/Configuracion.jsx"));
const Perfil = lazy(() => import("../components/layouts/Perfil/Perfil.jsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.jsx"));
const LeccionCompleta = lazy(() => import("../components/layouts/LeccionCompleta/LeccionCompleta.jsx"));

// ✅ Componente para proteger rutas autenticadas
const ProtectedRoute = ({ children, requireOnboarding = false, requireAdmin = false }) => {
  const { user, profile, shouldShowOnboarding, loading, initialized, profileError, refreshProfile, logout } = useAuth();
  const location = useLocation();
  // ⏳ Esperar a que termine la inicialización
  if (!initialized || loading) {
    return <LoadingSpinner message="Validando sesión..." />;
  }

  // 🔐 Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ⏳ Si hay sesión pero aún no llega el perfil, evitar rebote a login/dashboard.
  if (!profile) {
    if (profileError) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div>
            <h2>No pudimos cargar tu perfil</h2>
            <p style={{ color: "#666" }}>{profileError}</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
              <button type="button" onClick={() => refreshProfile()}>Reintentar</button>
              <button type="button" onClick={() => logout()}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      );
    }
    return <LoadingSpinner message="Cargando tu perfil..." />;
  }

  // 🎯 Ruta exclusiva para onboarding: si ya completó, enviar al dashboard.
  if (requireOnboarding) {
    return shouldShowOnboarding ? (
      children
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  // 🎯 Si todavía necesita onboarding, cualquier otra ruta protegida debe ir allí.
  if (shouldShowOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireAdmin) {
    const rol = profile?.rol;
    if (rol !== "admin" && rol !== "superadmin") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Si todo está bien, mostrar la ruta
  return children;
};

// ✅ Componente para rutas públicas (no autenticadas)
const PublicRoute = ({ children, redirectAuthenticated = true }) => {
  const { user, profile, shouldShowOnboarding, loading, initialized, registerLoading, profileError, refreshProfile, logout } = useAuth();

  // Solo bloquear en la primera carga; no desmontar login/register en requests locales.
  if (!initialized) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  // ⏳ Mostrar spinner durante el registro
  if (registerLoading) {
    return <LoadingSpinner message="Creando tu cuenta..." />;
  }

  // Evitar spinner global por loading de perfil cuando aún no hay sesión
  if (loading && user) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  // 🔓 Si no está autenticado, mostrar la ruta pública
  if (!user) {
    return children;
  }

  // ⏳ Hay sesión activa pero todavía se está resolviendo el perfil.
  if (!profile) {
    if (profileError) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div>
            <h2>No pudimos cargar tu perfil</h2>
            <p style={{ color: "#666" }}>{profileError}</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
              <button type="button" onClick={() => refreshProfile()}>Reintentar</button>
              <button type="button" onClick={() => logout()}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      );
    }
    return <LoadingSpinner message="Cargando tu perfil..." />;
  }

  // 🔒 Si está autenticado y debe redirigir
  if (redirectAuthenticated) {
    if (shouldShowOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function AppRouter() {
  const { initialized } = useAuth();

  // ⏳ Loading global solo hasta inicializar auth (no en cada login)
  if (!initialized) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner message="Cargando..." />}>
      <Routes>
        {/* 🌐 Rutas públicas (siempre accesibles) */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route path="/terminos" element={<TermsOfService />} />
        <Route path="/privacidad" element={<TermsOfService />} />
        <Route path="/nosotros" element={<Nosotros />} />

        {/* 📄 Landing - Página principal pública */}
        <Route
          path="/"
          element={
            <PublicRoute redirectAuthenticated={false}>
              <Landing />
            </PublicRoute>
          }
        />

        {/* 🚀 Started - Pre-onboarding */}
        <Route
          path="/started"
          element={
            <PublicRoute>
              <StartedPage />
            </PublicRoute>
          }
        />

        {/* 🔐 Login y Register - Solo para no autenticados */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 📚 Aprendizaje (requieren autenticación) */}
        <Route
          path="/desafios/:seccionId?"
          element={
            <ProtectedRoute>
              <Desafios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ejercicios/:seccionId?"
          element={
            <ProtectedRoute>
              <ModuloEjercicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ejercicios2"
          element={
            <ProtectedRoute>
              <DragConstraints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leccion-completa"
          element={
            <ProtectedRoute>
              <LeccionCompleta />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Rutas protegidas (requieren autenticación) */}

        {/* 🎯 Onboarding - Solo para usuarios nuevos */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Dashboard - Ruta principal después del onboarding */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 👤 Perfil y Configuración */}
        <Route
          path="/profile"
          element={<Navigate to="/perfil" replace />}
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          }
        />

        {/* 🏆 Ranking */}
        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <RankingPage />
            </ProtectedRoute>
          }
        />

        {/* 🎮 Mixto y Ejercicios */}
        <Route
          path="/mixto"
          element={
            <ProtectedRoute>
              <MixtoPage />
            </ProtectedRoute>
          }
        />

        {/* 🔧 Administración */}
        <Route
          path="/admin-be"
          element={
            <ProtectedRoute requireAdmin>
              <ConsolaAdmin />
            </ProtectedRoute>
          }
        />

        {/* 🛠️ Ruta de desarrollo */}
        {import.meta.env.DEV && (
          <Route path="/dev-Dashboard" element={<Perfil />} />
        )}

        {/* ❌ 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
       </Suspense>
    </Router>
  );
}
