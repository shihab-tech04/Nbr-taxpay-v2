import React from 'react';
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
          <HomeTile>
            <Slider2 language={language} c={c} onAction={onAction} paused={sliderPaused} />
          </HomeTile>

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
    </div>
  );
}
