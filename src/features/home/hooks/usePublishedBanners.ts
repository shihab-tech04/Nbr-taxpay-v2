import { useCallback, useEffect, useRef, useState } from 'react';
import { SLIDER2_TIMING, buildPublishedBackupSlides } from '../model/home.tokens';
import type { BannerLoadStatus, BannerSlide } from '../model/home.types';
import { fetchPublishedBanners, isBannerCmsConfigured } from '../services/bannerService';
import { brandingReadsAllowed, noteBrandingResponse } from '../services/brandingCmsHealth';

export function usePublishedBanners() {
  const [slides, setSlides] = useState<BannerSlide[]>(() => buildPublishedBackupSlides());
  const [bannerStatus, setBannerStatus] = useState<BannerLoadStatus>('ready');
  const [retryNonce, setRetryNonce] = useState(0);
  const activeBannerIdRef = useRef<string | null>(slides[0]?.id ?? null);
  const lastPublishedSignatureRef = useRef<string | null>(null);

  const setActiveBannerId = useCallback((id: string | null) => {
    activeBannerIdRef.current = id;
  }, []);

  const retryLoad = useCallback(() => {
    setBannerStatus('loading');
    setRetryNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!isBannerCmsConfigured()) {
      return;
    }

    let active = true;
    let inFlight = false;
    let lastRefreshStart = 0;

    const refresh = () => {
      if (!active || inFlight || !brandingReadsAllowed()) return;
      const now = Date.now();
      if (lastRefreshStart && now - lastRefreshStart < 60_000) return;
      inFlight = true;
      lastRefreshStart = now;

      void fetchPublishedBanners()
        .then((next) => {
          if (!active) return;
          const signature = JSON.stringify(next);
          if (signature !== lastPublishedSignatureRef.current) {
            lastPublishedSignatureRef.current = signature;
            setSlides(next);
          }
          setBannerStatus(next.length > 0 ? 'ready' : 'unavailable');
        })
        .catch(() => {
          if (!active) return;
          noteBrandingResponse(undefined, true);
          setBannerStatus((prev) => (slides.length > 0 ? 'ready' : prev === 'loading' ? 'unavailable' : prev));
        })
        .finally(() => {
          inFlight = false;
        });
    };

    refresh();

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('focus', onVisible);
    window.addEventListener('online', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    const poll = window.setInterval(onVisible, SLIDER2_TIMING.cmsFallbackPollMs);

    return () => {
      active = false;
      window.clearInterval(poll);
      window.removeEventListener('focus', onVisible);
      window.removeEventListener('online', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [retryNonce, slides.length]);

  return {
    slides,
    bannerStatus,
    retryLoad,
    activeBannerIdRef,
    setActiveBannerId,
  };
}
