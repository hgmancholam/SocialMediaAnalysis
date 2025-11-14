import { create } from 'zustand';

import { IOAuth2Options, UserSession } from '@esri/arcgis-rest-auth';
import { request } from '@esri/arcgis-rest-request';
import { env } from '@/config/env';

export type userSession = {
  token: string;
  username: string;
  state: string;
  expiresIn: Date;
};

interface SessionState {
  userSession: userSession | null;
  isSessionActive: boolean;
  setSession: (userSession: userSession | null) => void;
  clearSession: () => void;
  signIn: () => void;
  autenticar: (usuario: string, password: string) => void;
  validateToken: () => boolean;
}

const useStore = create<SessionState>((set) => ({
  userSession: null,
  setSession: (userSession: userSession | null) =>
    set({
      userSession: userSession,
      isSessionActive: userSession !== null && userSession.token.length > 0,
    }),
  clearSession: () => {
    set({ userSession: null, isSessionActive: false });
    localStorage.clear();
    window.location.reload();
  },
  isSessionActive: false,
  autenticar: async (usuario, passsword) => {
    const portalUrl = env.arcgis.portalUrl;
    const clientId = env.arcgis.clientId;
    const clientSecret = env.arcgis.apiKey;
    const username = usuario;
    const password = passsword;
    try {
      const response = await request(`${portalUrl}/oauth2/token`, {
        httpMethod: 'POST',
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          username,
          password,
          grant_type: 'password',
        },
      });

      // console.log("Token obtenido:", response.access_token);
      return response.access_token;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error al autenticar:', error);
      if (error.code === 400) {
        alert(error.message);
      }
    }
  },
  signIn: async () => {
    const REDIRECT_URI = `${window.location.origin}/callback.html`;

    if (
      env.arcgis.clientId !== undefined &&
      env.arcgis.clientId.length > 0 &&
      env.arcgis.portalUrl !== undefined &&
      env.arcgis.portalUrl.length > 0
    ) {
      const popupWidth = 600;
      const popupHeight = 400;
      const popupLeft = (window.screen.width - popupWidth) / 2;
      const popupTop = (window.screen.height - popupHeight) / 2;
      const newPopupWindowFeatures = `width=${popupWidth},height=${popupHeight},top=${popupTop},left=${popupLeft},menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,location=no`;

      const ioauthOptions: IOAuth2Options = {
        clientId: env.arcgis.clientId,
        popup: true,
        portal: env.arcgis.portalUrl,
        provider: 'arcgis',
        redirectUri: REDIRECT_URI,
        popupWindowFeatures: newPopupWindowFeatures,
        username: '',
        password: '',
      };
      console.log('ioauthOptions', ioauthOptions);

      if (ioauthOptions !== undefined) {
        const hasToken = localStorage.getItem('access_token') !== null;
        console.log('¿Tiene token en localStorage?:', hasToken);

        if (!hasToken) {
          console.log('Abriendo popup de autenticación...');
          try {
            await UserSession.beginOAuth2(ioauthOptions);
            console.log('Autenticación completada');
          } catch (error) {
            console.error('Error en beginOAuth2:', error);
          }
        } else {
          console.log('Ya existe un token en localStorage');
        }

        if (localStorage.getItem('error') !== null) {
          console.log('Error en autenticación, limpiando sesión');
          set({ userSession: null, isSessionActive: false });
        } else {
          const token = localStorage.getItem('access_token');
          if (token) {
            console.log('Estableciendo sesión con token:', token.substring(0, 20) + '...');
            set({
              userSession: {
                token: localStorage.getItem('access_token') || '',
                username: localStorage.getItem('username') || '',
                state: localStorage.getItem('state') || '',
                expiresIn: new Date(localStorage.getItem('expires_in') || ''),
              },
              isSessionActive: true,
            });
          }
        }
      } else {
        console.error('Error: ioauthOptions está indefinido.');
      }
    } else {
      console.error('Error: Faltan configuraciones de ArcGIS');
      console.error('clientId:', env.arcgis.clientId);
      console.error('portalUrl:', env.arcgis.portalUrl);
    }
  },
  validateToken: () => {
    // console.log("Validando token...");
    const storedToken = localStorage.getItem('access_token');
    const expiresIn = localStorage.getItem('expires_in');
    const now = new Date();
    const nowUtc = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    if (!storedToken || !expiresIn || new Date(expiresIn) <= nowUtc) {
      set({ userSession: null, isSessionActive: false });
      localStorage.clear();
      // console.log("Token NO válido");
      return false;
    } else {
      set({
        userSession: {
          token: localStorage.getItem('access_token') || '',
          username: localStorage.getItem('username') || '',
          state: localStorage.getItem('state') || '',
          expiresIn: new Date(localStorage.getItem('expires_in') || ''),
        },
        isSessionActive: true,
      });
      // console.log("Token válido");
      return true;
    }
  },
}));

export default useStore;
