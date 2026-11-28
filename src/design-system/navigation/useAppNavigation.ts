import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAppNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const isActive = useCallback(
    (path: string, exact = false) => {
      if (exact) {
        return currentPath === path;
      }
      return currentPath === path || (path !== '/' && currentPath.startsWith(path));
    },
    [currentPath]
  );

  const goBack = useCallback(
    (fallbackPath = '/dashboard') => {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate(fallbackPath);
      }
    },
    [navigate]
  );

  const navigateTo = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return {
    currentPath,
    isActive,
    goBack,
    navigateTo,
  };
}
