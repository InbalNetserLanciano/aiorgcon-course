import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Video} from '@remotion/media';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {BrandMark} from '../components/BrandMark';
import {LowerThird} from '../components/LowerThird';
import {ImpactOverlay} from '../components/ImpactOverlay';
import {BrandCard} from '../components/BrandCard';
import {PanelConfig, pad} from '../data';

interface Props {
  panel: PanelConfig;
  clipTrimFrames: number;
}

export const PanelScene: React.FC<Props> = ({panel, clipTrimFrames}) => {
  const n = pad(panel.panelIndex);
  const videoSrc = staticFile(`animated/clip_${n}.mp4`);
  const audioSrc = staticFile(`voiceover/panel_${n}.mp3`);

  return (
    <AbsoluteFill>
      <Video
        src={videoSrc}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
        trimAfter={clipTrimFrames}
      />
      <Audio src={audioSrc} />

      {panel.overlay.type === 'lower-third' && (
        <LowerThird label={panel.overlay.label} tagline={panel.overlay.tagline} />
      )}
      {panel.overlay.type === 'impact' && (
        <ImpactOverlay label={panel.overlay.label} tagline={panel.overlay.tagline} />
      )}
      {panel.overlay.type === 'brand-card' && <BrandCard />}

      {panel.showBrandMark && <BrandMark />}
    </AbsoluteFill>
  );
};
