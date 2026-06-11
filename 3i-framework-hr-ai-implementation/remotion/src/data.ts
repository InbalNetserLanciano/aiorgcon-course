// Scene configuration — overlay type and text for each of the 6 panels.
// Asset file names are derived from panelIndex at runtime.

export type OverlayConfig =
  | {type: 'lower-third'; line1: string; line2?: string}
  | {type: 'framework'}
  | {type: 'keywords'}
  | {type: 'closing'};

export interface PanelConfig {
  panelIndex: number;    // 1–6, drives asset filenames (clip_0N, panel_0N, panel_0N.mp3)
  sceneLabel: string;
  overlay: OverlayConfig;
  showBrandMark: boolean;
}

export const PANELS: PanelConfig[] = [
  {
    panelIndex: 1,
    sceneLabel: 'Scene 1 — AI Is Already Here',
    overlay: {
      type: 'lower-third',
      line1: 'AI is already inside the organization.',
    },
    showBrandMark: false,
  },
  {
    panelIndex: 2,
    sceneLabel: 'Scene 2 — The Strategic Decision',
    overlay: {
      type: 'lower-third',
      line1: 'The CEO and CHRO decide:',
      line2: 'AI must support organizational goals.',
    },
    showBrandMark: true,
  },
  {
    panelIndex: 3,
    sceneLabel: 'Scene 3 — The Real Challenge',
    overlay: {type: 'keywords'},
    showBrandMark: true,
  },
  {
    panelIndex: 4,
    sceneLabel: 'Scene 4 — The 3I Framework',
    overlay: {type: 'framework'},
    showBrandMark: true,
  },
  {
    panelIndex: 5,
    sceneLabel: 'Scene 6 — Integrate',
    overlay: {
      type: 'lower-third',
      line1: '2. INTEGRATE',
      line2: 'Workflows, Teams and Processes',
    },
    showBrandMark: true,
  },
  {
    panelIndex: 6,
    sceneLabel: 'Scene 8 — The New Architecture for Work',
    overlay: {type: 'closing'},
    showBrandMark: true,
  },
];

// Keywords shown in Scene 3 floating cloud
export const CHALLENGE_KEYWORDS = [
  'Privacy', 'Skills', 'Adoption', 'Data',
  'Governance', 'Trust', 'Workflows', 'Measurement',
];

// Helper: zero-padded panel number → "01", "02", …
export const pad = (n: number) => String(n).padStart(2, '0');
