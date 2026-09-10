import AppRouter from './routes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import "./App.css";
import { MascotProvider } from './mascotas/core/MascotProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MascotProvider>
          <AppRouter />
        </MascotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
