import { SCENES, type SceneMeta } from '../lib/constants';
import type { Settings } from '../types';
import { Icon, Range, SectionLabel, cx } from './ui';

const MAIN_SCENES = SCENES.filter((scene) => scene.group !== 'simple');
const SIMPLE_SCENES = SCENES.filter((scene) => scene.group === 'simple');

function SceneCard({
  scene,
  active,
  onSelect,
}: {
  scene: SceneMeta;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cx(
        'group relative overflow-hidden rounded-2xl border text-left transition duration-500 ease-soft focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
        active ? 'border-accent/45' : 'border-white/[0.07] hover:border-white/[0.18]',
      )}
    >
      <span
        className="relative block h-[76px] w-full transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
        style={{ background: scene.preview }}
      >
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {active ? (
          <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-black/45 text-accent backdrop-blur">
            <Icon name="check" size={11} />
          </span>
        ) : null}
      </span>
      <span className="block bg-white/[0.02] px-3 py-2.5">
        <span className="block text-[11.5px] text-cream/85">{scene.name}</span>
        <span className="mt-0.5 block truncate text-[9.5px] text-mist/40">{scene.mood}</span>
      </span>
    </button>
  );
}

export function ScenesPanel({
  settings,
  patch,
}: {
  settings: Settings;
  patch: (patch: Partial<Settings>) => void;
}) {
  return (
    <div className="space-y-9">
      <section>
        <SectionLabel>Simple themes</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {SIMPLE_SCENES.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              active={settings.scene === scene.id}
              onSelect={() => patch({ scene: scene.id })}
            />
          ))}
        </div>
        <p className="mt-3 text-[10.5px] leading-relaxed text-mist/35">
          Flat colors with no scene motion.
        </p>
      </section>

      <section>
        <SectionLabel>Atmosphere</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {MAIN_SCENES.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              active={settings.scene === scene.id}
              onSelect={() => patch({ scene: scene.id })}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Fine tuning</SectionLabel>
        <div className="space-y-6">
          <Range
            label="Brightness"
            value={Math.round(settings.brightness * 100)}
            min={40}
            max={140}
            step={1}
            display={`${Math.round(settings.brightness * 100)}%`}
            onChange={(value) => patch({ brightness: value / 100 })}
          />
          <Range
            label="Background blur"
            value={settings.blur}
            min={0}
            max={24}
            step={1}
            display={`${settings.blur}px`}
            onChange={(value) => patch({ blur: value })}
          />
          <Range
            label="Overlay darkness"
            value={Math.round(settings.overlay * 100)}
            min={0}
            max={80}
            step={1}
            display={`${Math.round(settings.overlay * 100)}%`}
            onChange={(value) => patch({ overlay: value / 100 })}
          />
          <Range
            label="Animation intensity"
            value={Math.round(settings.intensity * 100)}
            min={0}
            max={100}
            step={1}
            display={`${Math.round(settings.intensity * 100)}%`}
            onChange={(value) => patch({ intensity: value / 100 })}
          />
        </div>
        <p className="mt-6 text-[10.5px] leading-relaxed text-mist/35">
          Scene motion pauses automatically when your system asks for reduced motion.
        </p>
      </section>
    </div>
  );
}
