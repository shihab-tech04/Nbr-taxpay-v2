import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { HomeViewProps } from '../model/home.types';
import { HomeTile } from './HomeBrand';
import { HomeHeader } from './HomeHeader';
import { Slider2 } from './Slider2';
import { PaymentRecordSearch } from './PaymentRecordSearch';
import { HelpCard } from './HelpCard';
import { HomeServiceGrid } from './HomeServiceGrid';
import { HomeFooter } from './HomeFooter';

export function HomeDesktopLayout({
  c,
  language,
  onToggleLang,
  onAction,
  onSearch,
  signedIn,
  sliderPaused,
}: HomeViewProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6fa]">
      <HomeHeader
        c={c}
        variant="desktop"
        signedIn={signedIn}
        onToggleLang={onToggleLang}
        onAction={onAction}
      />

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-8 pt-5 pb-14">
        <section
          aria-label={c.heroTitle}
          className="grid grid-cols-[minmax(0,1fr)_clamp(320px,30vw,372px)] gap-3"
        >
          <TileSliderWrapper>
            <Slider2 language={language} c={c} onAction={onAction} paused={sliderPaused} />
          </TileSliderWrapper>

          <div className="home2-v2-type flex flex-col gap-4">
            <HomeTile delay={80}>
              <PaymentRecordSearch c={c} variant="desktop" onSearch={onSearch} />
            </HomeTile>
            <HomeTile delay={140} className="flex flex-1 flex-col">
              <HelpCard c={c} variant="desktop" onAction={onAction} />
            </HomeTile>
          </div>
        </section>

        <HomeServiceGrid
          c={c}
          variant="desktop"
          signedIn={signedIn}
          onAction={onAction}
        />
      </main>

      <HomeFooter c={c} variant="desktop" onAction={onAction} />

      <button
        type="button"
        onClick={() => onAction('help')}
        className="home2-v2-type home2-press fixed right-6 bottom-6 z-30 flex h-11 items-center gap-2 rounded-full bg-white pr-4.5 pl-3.5 text-[13.5px] font-semibold text-[#1c3d70] shadow-[0_10px_28px_-12px_rgba(15,29,52,0.35)] ring-1 ring-[#dfe5ee] hover:bg-[#f4f7fc]"
      >
        <MessageCircle className="size-[18px]" aria-hidden="true" /> {c.nav.help}
      </button>
    </div>
  );
}

function TileSliderWrapper({ children }: { children: React.ReactNode }) {
  return <HomeTile>{children}</HomeTile>;
}
