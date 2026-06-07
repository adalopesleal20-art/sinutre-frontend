import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { getToken, setToken } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const DRAWER_ID = 'main-drawer';

// Lê ?token=... do callback do backend (rota /auth/github/callback),
// salva no localStorage e limpa a query string da URL.
function consumeTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (!token) return null;
  setToken(token);
  window.history.replaceState({}, '', window.location.pathname);
  return token;
}

export default function App() {
  const { user, loading } = useAuth();

  const [token, setLocalToken] = useState<string | null>(
    () => consumeTokenFromUrl() ?? getToken(),
  );

  useEffect(() => {
    // Caso o token chegue depois do mount (ex.: voltando do GitHub).
    const fromUrl = consumeTokenFromUrl();
    if (fromUrl) setLocalToken(fromUrl);
  }, []);

  if (!token) {
    return <LoginPage />;
  }
  
  if (loading) {
    <div>
      Carregando usuário...
    </div>
  }else{
    return (
      <div className="drawer lg:drawer-open bg-base-200 text-base-content min-h-screen">
        <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col items-center p-4 lg:p-8 w-full">
          <DashboardPage drawerId={DRAWER_ID} />
        </div>

        <Sidebar drawerId={DRAWER_ID} />
      </div>
    );
  }
}
