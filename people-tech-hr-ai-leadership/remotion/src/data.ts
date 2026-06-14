export type OverlayConfig =
  | {type: 'none'}
  | {type: 'lower-third'; label: string; tagline: string}
  | {type: 'impact'; label: string; tagline: string}
  | {type: 'brand-card'};

export interface PanelConfig {
  panelIndex: number;
  sceneLabel: string;
  overlay: OverlayConfig;
  showBrandMark: boolean;
}

export const PANELS: PanelConfig[] = [
  {
    panelIndex: 1,
    sceneLabel: 'Scene 1 — The Silo Problem',
    overlay: {type: 'none'},
    showBrandMark: false,
  },
  {
    panelIndex: 2,
    sceneLabel: 'Scene 2 — IMPROVE',
    overlay: {
      type: 'lower-third',
      label: 'I1 · IMPROVE',
      tagline: 'Build your own fluency first.',
    },
    showBrandMark: false,
  },
  {
    panelIndex: 3,
    sceneLabel: 'Scene 3 — INTEGRATE',
    overlay: {
      type: 'lower-third',
      label: 'I2 · INTEGRATE',
      tagline: 'One process. One table. No silos.',
    },
    showBrandMark: false,
  },
  {
    panelIndex: 4,
    sceneLabel: 'Scene 4 — IMPACT',
    overlay: {
      type: 'impact',
      label: 'I3 · IMPACT',
      tagline: "HR doesn't just implement AI. HR redesigns the organization for it.",
    },
    showBrandMark: false,
  },
  {
    panelIndex: 5,
    sceneLabel: 'Scene 5 — The New Organization',
    overlay: {type: 'none'},
    showBrandMark: true,
  },
  {
    panelIndex: 6,
    sceneLabel: 'Scene 6 — CTA',
    overlay: {type: 'brand-card'},
    showBrandMark: false,
  },
];

export const pad = (n: number) => String(n).padStart(2, '0');
