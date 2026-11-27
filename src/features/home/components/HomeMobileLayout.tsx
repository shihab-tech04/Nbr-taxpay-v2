import React from 'react';
import type { HomeViewProps } from '../model/home.types';
import { HomeTile } from './HomeBrand';
import { HomeHeader } from './HomeHeader';
import { Slider2 } from './Slider2';
import { PaymentRecordSearch } from './PaymentRecordSearch';
import { HomeServiceGrid } from './HomeServiceGrid';
import { HomeFooter, MobileQuickLinks } from './HomeFooter';
import { HomeMobileNavigation } from './HomeMobileNavigation';

export function HomeMobileLayout({
  c,
  language,
  onToggleLang,
  onAction,
  onSearch,
  signedIn,
  sliderPaused,
}: HomeViewProps) {
  return (
    <div className="min-h-screen w-full bg-[#e6eaf1]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#f4f6fa] pb-24 shadow-[0_0_60px_-20px_rgba(15,29,52,0.25)]">
        <HomeHeader
          c={c}
          variant="mobile"
          signedIn={signedIn}
          onToggleLang={onToggleLang}
          onAction={onAction}
        />

        <main className="space-y-3 px-4 pt-3">
          <HomeTile>
            <Slider2 language={language} c={c} onAction={onAction} paused={sliderPaused} />
          </HomeTile>

          <HomeTile delay={80}>
            <PaymentRecordSearch c={c} variant="mobile" onSearch={onSearch} />
          </HomeTile>

          <div className="home2-v2-type space-y-3">
            <HomeServiceGrid
              c={c}
              variant="mobile"
              signedIn={signedIn}
              onAction={onAction}
            />
            <MobileQuickLinks c={c} onAction={onAction} />
          </div>
        </main>

        <div className="px-4">
          <HomeFooter c={c} variant="mobile" onAction={onAction} />
        </div>

        <HomeMobileNavigation c={c} onAction={onAction} />
      </div>
    </div>
  );
}
