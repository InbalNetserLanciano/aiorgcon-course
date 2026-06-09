import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Video} from '@remotion/media';
import {Audio} from '@remotion/media';
import {BrandMark} from '../components/BrandMark';
import {LowerThird} from '../components/LowerThird';
import {FloatingKeywords} from '../components/FloatingKeywords';
import {FrameworkReveal} from '../components/FrameworkReveal';
import {ClosingCard} from '../components/ClosingCard';
import {PanelConfig, pad} from '../data';
import {FPS} from '../constants';

interface PanelSceneProps {
  panel: PanelConfig;
  // Duration for this scene in frames (pre-calculated by calculateMetadata)
  durationInFrames: number;
  // How many frames of the clip to show (trimAfter)
  clipTrimFrames: number;
}

export const PanelScene: React.FC<PanelSceneProps> = ({panel, clipTrimFrames}) => {
  const n = pad(panel.panelIndex);
  const videoSrc = staticFile(`animated/clip_${n}.mp4`);
  const audioSrc = staticFile(`voiceover/panel_${n}.mp3`);

  return (
    <AbsoluteFill>
      {/* Background video — trimmed to clipTrimFrames */}
      <Video
        src={videoSrc}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
        trimAfter={clipTrimFrames}
      />

      {/* Voiceover audio */}
      <Audio src={audioSrc} />

      {/* Overlay */}
      {panel.overlay.type === 'lower-third' && (
        <LowerThird line1={panel.overlay.line1} line2={panel.overlay.line2} />
      )}
      {panel.overlay.type === 'keywords' && <FloatingKeywords />}
      {panel.overlay.type === 'framework' && <FrameworkReveal />}
      {panel.overlay.type === 'closing' && <ClosingCard />}

      {/* Brand watermark */}
      {panel.showBrandMark && <BrandMark />}
    </AbsoluteFill>
  );
};
