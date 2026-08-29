import AppRouter from './routes'
import { AuthProvider } from './context/AuthContext';
import "./App.css";
import { MascotProvider } from './mascotas/core/MascotProvider';

function App() {
  return (
    <AuthProvider>
      <MascotProvider>
        <AppRouter />
      </MascotProvider>
    </AuthProvider>
  )
}

export default App