import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {PURPLE, TURQUOISE, WHITE} from '../constants';

const {fontFamily} = loadFont('normal', {weights: ['300', '700'], subsets: ['latin']});

interface Props {
  label: string;
  tagline: string;
}

export const LowerThird: React.FC<Props> = ({label, tagline}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const slideIn = interpolate(frame, [15, 32], [60, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const taglineOpacity = interpolate(frame, [28, 44], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 80px 64px',
        opacity: Math.min(opacity, fadeOut),
        transform: `translateY(${slideIn}px)`,
      }}
    >
      <div style={{width: 48, height: 3, background: TURQUOISE, borderRadius: 2, marginBottom: 12}} />
      <div
        style={{
          background: `linear-gradient(90deg, ${PURPLE}ee 0%, ${PURPLE}99 60%, transparent 100%)`,
          padding: '16px 32px',
          borderLeft: `3px solid ${TURQUOISE}`,
          backdropFilter: 'blur(4px)',
          display: 'inline-block',
          minWidth: 480,
        }}
      >
        <div style={{fontFamily, fontSize: 28, fontWeight: 700, color: TURQUOISE, letterSpacing: '0.1em'}}>
          {label}
        </div>
        <div style={{fontFamily, fontSize: 22, fontWeight: 300, color: WHITE, letterSpacing: '0.02em', marginTop: 4, opacity: taglineOpacity}}>
          {tagline}
        </div>
      </div>
    </div>
  );
};
