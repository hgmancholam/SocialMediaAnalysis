'use client';

import { useEffect, useState } from 'react';
import useStore from './SessionState';

/**
 * SessionProvider - Componente que valida la sesión del usuario automáticamente
 * Muestra una pantalla de autenticación mientras no haya sesión activa
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { isSessionActive, validateToken, signIn } = useStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isValid = validateToken();

    if (!isValid) {
      console.log('Sesión no válida, iniciando autenticación...');
      signIn();
    }

    setIsChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mostrar pantalla de carga mientras se verifica la sesión
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F1419]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión activa, mostrar pantalla de autenticación
  if (!isSessionActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F1419]">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl font-bold text-white mb-4">Social Media Analysis</h1>
          <p className="text-gray-400 mb-8">
            Inicie sesión para acceder al sistema de visualización de datos de redes sociales
          </p>
          <div className="animate-pulse text-[#3B82F6]">Autenticando con ArcGIS Portal...</div>
        </div>
      </div>
    );
  }

  // Si hay sesión activa, mostrar el contenido
  return <>{children}</>;
}
