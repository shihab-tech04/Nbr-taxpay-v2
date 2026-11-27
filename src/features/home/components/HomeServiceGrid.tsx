import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import type { HomeAction, HomeCopy } from '../model/home.types';
import { HomeTile } from './HomeBrand';
import { AllTaxPaymentsCard } from './AllTaxPaymentsCard';
import { PaymentHistoryCard } from './PaymentHistoryCard';
import {
  DesktopMiniTile,
  DesktopWideTile,
  MobileMiniTile,
  MobileSecurityTile,
} from './ServiceTile';
import { HelpCard } from './HelpCard';

export function HomeServiceGrid({
  c,
  variant,
  signedIn,
  onAction,
}: {
  c: HomeCopy;
  variant: 'desktop' | 'mobile';
  signedIn: boolean;
  onAction: (action: HomeAction) => void;
}) {
  const f = c.features;
  const open = (action: HomeAction) => () => onAction(action);

  if (variant === 'mobile') {
    return (
      <>
        <HomeTile delay={140} className="px-1 pt-4 pb-1">
          <h2 id="features-title" className="text-[22px] leading-tight font-bold tracking-[-0.025em]">
            {c.section.title}
          </h2>
        </HomeTile>
        <div className="grid grid-cols-2 gap-3">
          <HomeTile delay={180} className="col-span-2">
            <AllTaxPaymentsCard c={c} variant="mobile" onAction={onAction} />
          </HomeTile>
          <HomeTile delay={220} className="row-span-2">
            <PaymentHistoryCard c={c} variant="mobile" onAction={onAction} />
          </HomeTile>
          <MobileMiniTile
            delay={260}
            art="certificate"
            title={f.certs.title}
            body={f.certs.short}
            onClick={open('certificates')}
            tone="bg-[#cecfeb]"
            accent="#b0b1dc"
          />
          <MobileMiniTile
            delay={300}
            art="edit"
            title={f.corrections.title}
            body={f.corrections.short}
            onClick={open('corrections')}
            tone="bg-[#e3d2d4]"
            accent="#cfb5b9"
          />
          <MobileMiniTile
            delay={340}
            art="repeat"
            title={f.again.title}
            body={f.again.short}
            onClick={open('again')}
            tone="bg-[#cce4eb]"
            accent="#acd0dc"
          />
          <MobileMiniTile
            delay={380}
            art="folder"
            title={f.drafts.title}
            body={f.drafts.short}
            onClick={open('drafts')}
            tone="bg-[#d5e6d4]"
            accent="#bad4b9"
          />
          <MobileSecurityTile
            delay={420}
            title={f.secure.title}
            body={f.secure.body}
            onClick={open('security')}
          />
          <HomeTile delay={460} className="col-span-2">
            <HelpCard c={c} variant="mobile" onAction={onAction} />
          </HomeTile>
        </div>
      </>
    );
  }

  return (
    <section className="home2-v2-type mt-12" aria-labelledby="features-title">
      <HomeTile delay={200} className="mb-5 flex items-center justify-between gap-6">
        <h2
          id="features-title"
          className="min-w-0 text-[28px] leading-tight font-bold tracking-[-0.025em]"
        >
          {c.section.title}
        </h2>
        <AppButton
          actionType="secondary"
          palette="home"
          surface="outlined"
          size="medium"
          data-testid="home2-dashboard-action"
          onClick={open('login')}
          endIcon={
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          }
          className="home2-press group shrink-0"
          sx={{
            minHeight: 40,
            px: 2,
            py: 1,
            fontSize: '14px',
            fontWeight: 600,
            color: '#244d8f',
            borderColor: '#dfe5ee',
            bgcolor: '#ffffff',
            '&:hover': {
              bgcolor: '#f7f9fd',
              color: '#162d53',
              borderColor: '#dfe5ee',
            },
          }}
        >
          {signedIn ? c.dashboardCta : c.section.cta}
        </AppButton>
      </HomeTile>

      <div className="grid grid-cols-12 grid-rows-[repeat(2,minmax(150px,auto))_minmax(112px,auto)] gap-4">
        <HomeTile delay={240} className="col-span-6 row-span-2">
          <AllTaxPaymentsCard c={c} variant="desktop" onAction={onAction} />
        </HomeTile>
        <HomeTile delay={280} className="col-span-3 row-span-2">
          <PaymentHistoryCard c={c} variant="desktop" onAction={onAction} />
        </HomeTile>
        <DesktopMiniTile
          delay={320}
          art="certificate"
          title={f.certs.title}
          body={f.certs.body}
          onClick={open('certificates')}
          tone="bg-[#cecfeb]"
          accent="#b0b1dc"
        />
        <DesktopMiniTile
          delay={360}
          art="edit"
          title={f.corrections.title}
          body={f.corrections.body}
          onClick={open('corrections')}
          tone="bg-[#e3d2d4]"
          accent="#cfb5b9"
        />
        <DesktopWideTile
          delay={400}
          art="repeat"
          title={f.again.title}
          body={f.again.body}
          onClick={open('again')}
          tone="bg-[#e3ddd4]"
          accent="#cfc6b9"
        />
        <DesktopWideTile
          delay={440}
          art="folder"
          title={f.drafts.title}
          body={f.drafts.body}
          onClick={open('drafts')}
          tone="bg-[#d5e6d4]"
          accent="#bad4b9"
        />
        <DesktopWideTile
          delay={480}
          art="shield"
          title={f.secure.title}
          body={f.secure.body}
          onClick={open('security')}
          tone="bg-[#cad8ef]"
          accent="#a5bce1"
        />
      </div>
    </section>
  );
}
