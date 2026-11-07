import type { SceneId } from '../types';
import { AmbientCanvas } from './AmbientCanvas';
import { SceneArt } from './SceneArt';

export function AmbientBackdrop({
  scene,
  brightness,
  blur,
  overlay,
  intensity,
}: {
  scene: SceneId;
  brightness: number;
  blur: number;
  overlay: number;
  intensity: number;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#05060a]" aria-hidden="true">
      <div
        key={scene}
        className="absolute inset-0 animate-fadeIn"
        style={{
          animationDuration: '1200ms',
          filter: `brightness(${brightness})${blur > 0.1 ? ` blur(${blur}px)` : ''}`,
          transform: blur > 0.1 ? 'scale(1.04)' : undefined,
          transition: 'filter 500ms ease, transform 500ms ease',
        }}
      >
        <SceneArt scene={scene} />
        <AmbientCanvas scene={scene} intensity={intensity} />
      </div>

      <div
        className="absolute inset-0 bg-[#04050a]"
        style={{ opacity: overlay, transition: 'opacity 400ms ease' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 95% at 50% 22%, transparent 32%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-44"
        style={{ background: 'linear-gradient(to top, rgba(4,5,8,0.6), transparent)' }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
