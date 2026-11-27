import { useCallback, useEffect, useRef, useState } from 'react';
import { SLIDER2_TIMING } from '../model/home.manifest';
import { buildPublishedBackupSlides } from '../model/home.slides';
import type {
  BannerCmsConnectionState,
  BannerLoadStatus,
  BannerSlide,
} from '../model/home.types';
import { fetchPublishedBanners, isBannerCmsConfigured } from '../services/bannerService';
import { brandingReadsAllowed, noteBrandingResponse } from '../services/brandingCmsHealth';

export function usePublishedBanners() {
  const configured = isBannerCmsConfigured();
  const [slides, setSlides] = useState<BannerSlide[]>(() => buildPublishedBackupSlides());
  const [bannerStatus, setBannerStatus] = useState<BannerLoadStatus>(() =>
    configured ? 'loading' : 'ready'
  );
  const [cmsState, setCmsState] = useState<BannerCmsConnectionState>(() =>
    configured ? 'configured' : 'unconfigured'
  );
  const [retryNonce, setRetryNonce] = useState(0);

  const slidesRef = useRef<BannerSlide[]>(slides);
  const lastPublishedSignatureRef = useRef<string | null>(null);
  const hasLiveLoadRef = useRef(false);

  const retryLoad = useCallback(() => {
    if (!isBannerCmsConfigured()) {
      setCmsState('unconfigured');
      return;
    }
    setBannerStatus('loading');
    setCmsState('loading');
    setRetryNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!isBannerCmsConfigured()) {
      setCmsState('unconfigured');
      return;
    }

    let active = true;
    let inFlightController: AbortController | null = null;
    let lastRefreshStart = 0;

    const refresh = (force = false) => {
      if (!active || inFlightController !== null || !brandingReadsAllowed()) return;
      const now = Date.now();
      if (!force && lastRefreshStart && now - lastRefreshStart < 60_000) return;

      const controller = new AbortController();
      inFlightController = controller;
      lastRefreshStart = now;
      if (!hasLiveLoadRef.current) {
        setCmsState('loading');
      }

      void fetchPublishedBanners({ signal: controller.signal })
        .then((next) => {
          if (!active || controller.signal.aborted) return;
          hasLiveLoadRef.current = true;
          const signature = JSON.stringify(next);
          if (signature !== lastPublishedSignatureRef.current) {
            lastPublishedSignatureRef.current = signature;
            slidesRef.current = next;
            setSlides(next);
          }
          if (next.length > 0) {
            setBannerStatus('ready');
            setCmsState('ready');
          } else {
            setBannerStatus('unavailable');
            setCmsState('empty');
          }
        })
        .catch((error: unknown) => {
          if (!active || controller.signal.aborted) return;
          if (error instanceof DOMException && error.name === 'AbortError') return;
          noteBrandingResponse(undefined, true);
          setCmsState('unavailable');
          setBannerStatus(slidesRef.current.length > 0 ? 'ready' : 'unavailable');
        })
        .finally(() => {
          if (inFlightController === controller) {
            inFlightController = null;
          }
        });
    };

    refresh(retryNonce > 0);

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh(false);
    };

    window.addEventListener('focus', onVisible);
    window.addEventListener('online', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    const poll = window.setInterval(onVisible, SLIDER2_TIMING.cmsFallbackPollMs);

    return () => {
      active = false;
      inFlightController?.abort();
      inFlightController = null;
      window.clearInterval(poll);
      window.removeEventListener('focus', onVisible);
      window.removeEventListener('online', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [retryNonce]);

  return {
    slides,
    bannerStatus,
    cmsState,
    isLiveCmsConnected: cmsState === 'ready' || cmsState === 'empty',
    retryLoad,
  };
}
