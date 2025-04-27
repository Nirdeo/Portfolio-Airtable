"use client";

import { useState, useEffect } from 'react';

type AuthStatus = {
  isAuthenticated: boolean;
  loading: boolean;
  user?: any;
};

export function useAuth(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    loading: true,
    user: null
  });

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        setAuthStatus({
          isAuthenticated: data.isAuthenticated,
          loading: false,
          user: data.user || null
        });
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthStatus({
          isAuthenticated: false,
          loading: false,
          user: null
        });
      }
    }

    checkAuthStatus();
  }, []);

  return authStatus;
} 