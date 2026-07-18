import { useEffect, useState } from 'react';
import { api } from './services/api';
import Home from './pages/Home';
import './index.css';

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    // Check backend health on mount
    const checkBackend = async () => {
      try {
        await api.health();
        setBackendReady(true);
        setBackendError(null);
      } catch (error: any) {
        setBackendReady(false);
        setBackendError(error.message || 'Backend is not available');
      }
    };

    checkBackend();

    // Try again every 5 seconds if backend is not ready
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!backendReady) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">WallBloom</h1>
          <p className="text-sm text-slate-500 mb-6">Connecting to backend...</p>
          {backendError && (
            <p className="text-sm text-red-400">⚠️ Backend not reachable</p>
          )}
        </div>
      </div>
    );
  }

  return <Home />;
}

export default App;
