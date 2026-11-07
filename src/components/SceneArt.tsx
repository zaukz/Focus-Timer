import type { CSSProperties, ReactNode } from 'react';
import type { SceneId } from '../types';
import { SCENES } from '../lib/constants';

function Glow({
  children,
  style,
  className,
}: {
  children?: ReactNode;
  style: CSSProperties;
  className?: string;
}) {
  return (
    <div aria-hidden className={`absolute rounded-full ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

function FlatScene({ background }: { background: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background }} />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.035), transparent 46%)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 95% at 50% 22%, transparent 42%, rgba(0,0,0,0.28) 100%)',
        }}
      />
    </>
  );
}

export function SceneArt({ scene }: { scene: SceneId }) {
  switch (scene) {
    case 'rain':
      return (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(125% 100% at 72% -6%, #263c50 0%, #12222e 44%, #070b11 100%)',
            }}
          />
          <Glow
            className="animate-drift"
            style={{
              width: '58vmax',
              height: '58vmax',
              right: '-14%',
              top: '-22%',
              background: 'radial-gradient(circle, rgba(128,170,204,0.26), transparent 62%)',
            }}
          />
          <Glow
            style={{
              width: '38vmax',
              height: '38vmax',
              left: '6%',
              bottom: '-14%',
              background: 'radial-gradient(circle, rgba(214,164,112,0.13), transparent 66%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                'linear-gradient(108deg, transparent 34%, rgba(194,219,238,0.05) 47%, transparent 58%), radial-gradient(60% 45% at 82% 22%, rgba(170,205,230,0.08), transparent 70%)',
            }}
          />
          <div
            aria-hidden
            className="absolute right-[12%] top-[16%] h-16 w-16 rounded-full opacity-40 blur-xl"
            style={{ background: 'radial-gradient(circle, rgba(255,206,150,0.4), transparent 70%)' }}
          />
          <div
            aria-hidden
            className="absolute right-[22%] top-[30%] h-10 w-10 rounded-full opacity-30 blur-lg"
            style={{ background: 'radial-gradient(circle, rgba(180,220,240,0.5), transparent 70%)' }}
          />
        </>
      );

    case 'stars':
      return (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(135% 110% at 50% -6%, #232e58 0%, #0a1124 46%, #03050c 100%)',
            }}
          />
          <div
            className="absolute -left-[20%] top-[2%] h-[52%] w-[140%] -rotate-[14deg] opacity-80"
            style={{
              background:
                'radial-gradient(55% 45% at 50% 50%, rgba(150,170,224,0.14), transparent 72%)',
              filter: 'blur(26px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(116deg, transparent 28%, rgba(168,186,232,0.05) 42%, rgba(206,214,246,0.07) 50%, transparent 66%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[32%]"
            style={{ background: 'linear-gradient(to top, rgba(24,34,64,0.5), transparent)' }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[10%]"
            style={{ background: 'linear-gradient(to top, rgba(3,6,14,0.85), transparent)' }}
          />
        </>
      );

    case 'snow':
      return (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(130% 110% at 50% -10%, #34455f 0%, #172235 48%, #070b12 100%)',
            }}
          />
          <Glow
            className="animate-drift"
            style={{
              width: '52vmax',
              height: '52vmax',
              left: '-12%',
              top: '-20%',
              background: 'radial-gradient(circle, rgba(168,198,234,0.22), transparent 64%)',
            }}
          />
          <Glow
            style={{
              width: '34vmax',
              height: '34vmax',
              right: '-8%',
              bottom: '-12%',
              background: 'radial-gradient(circle, rgba(142,172,210,0.14), transparent 66%)',
            }}
          />
          <div
            aria-hidden
            className="absolute right-[16%] top-[13%] h-[9vmax] w-[9vmax] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(238,245,255,0.5), transparent 68%)',
              boxShadow: '0 0 90px rgba(196,218,246,0.18)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(155deg, transparent 42%, rgba(190,210,236,0.045) 58%, transparent 76%)',
            }}
          />
          <svg
            viewBox="0 0 1000 320"
            preserveAspectRatio="xMidYMax slice"
            className="absolute inset-x-0 bottom-0 h-[46%] w-full"
            aria-hidden="true"
          >
            <path
              d="M0 226 C 120 196 210 244 320 236 C 440 227 520 178 640 196 C 760 214 850 252 1000 222 L1000 320 L0 320 Z"
              fill="rgba(126,150,182,0.2)"
            />
            <path
              d="M0 276 C 150 246 280 286 420 274 C 560 262 700 236 820 258 C 900 272 960 284 1000 278 L1000 320 L0 320 Z"
              fill="rgba(206,222,241,0.14)"
            />
          </svg>
          <div
            className="absolute inset-x-0 bottom-0 h-[26%]"
            style={{ background: 'linear-gradient(to top, rgba(4,8,14,0.82), transparent)' }}
          />
        </>
      );

    case 'sand':
    case 'sage':
    case 'slate':
    case 'clay':
    case 'moss':
    case 'espresso':
    case 'twilight':
    case 'rose':
    case 'tide':
    case 'plum':
    case 'ash':
    case 'copper':
    case 'mist':
    case 'merlot': {
      const meta = SCENES.find((item) => item.id === scene);
      return <FlatScene background={meta?.preview ?? '#0b0a08'} />;
    }

    case 'minimal':
    default:
      return (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(135% 110% at 50% -12%, #24272e 0%, #0d0f13 46%, #06070a 100%)',
            }}
          />
          <Glow
            className="animate-drift"
            style={{
              width: '62vmax',
              height: '62vmax',
              left: '-16%',
              top: '-24%',
              background: 'radial-gradient(circle, rgba(118,142,178,0.16), transparent 64%)',
            }}
          />
          <Glow
            style={{
              width: '46vmax',
              height: '46vmax',
              right: '-14%',
              bottom: '-16%',
              background: 'radial-gradient(circle, rgba(206,158,112,0.14), transparent 66%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.03), transparent 40%)',
            }}
          />
        </>
      );
  }
}
