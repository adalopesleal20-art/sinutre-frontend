import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getToken, setToken } from '@/lib/api';
import { useEffect, useState } from 'react';

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


export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  const [token, setLocalToken] = useState<string | null>(
      () => consumeTokenFromUrl() ?? getToken(),
    );


  useEffect(() => {
      // Caso o token chegue depois do mount (ex.: voltando do GitHub).
      const fromUrl = consumeTokenFromUrl();
      if (fromUrl) setLocalToken(fromUrl);
    }, []);
    
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
}