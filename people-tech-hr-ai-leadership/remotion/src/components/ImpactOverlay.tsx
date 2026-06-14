import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {PURPLE, TURQUOISE, WHITE} from '../constants';

const {fontFamily} = loadFont('normal', {weights: ['300', '700', '900'], subsets: ['latin']});

interface Props {
  label: string;
  tagline: string;
}

export const ImpactOverlay: React.FC<Props> = ({label, tagline}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const slideIn = interpolate(frame, [10, 28], [80, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const taglineOpacity = interpolate(frame, [22, 42], [0, 1], {
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
      <div style={{width: 64, height: 3, background: TURQUOISE, borderRadius: 2, marginBottom: 14}} />
      <div
        style={{
          background: `linear-gradient(90deg, ${PURPLE}f2 0%, ${PURPLE}aa 55%, transparent 100%)`,
          padding: '20px 36px',
          borderLeft: `4px solid ${TURQUOISE}`,
          backdropFilter: 'blur(6px)',
          display: 'inline-block',
          maxWidth: 860,
        }}
      >
        <div style={{fontFamily, fontSize: 34, fontWeight: 900, color: TURQUOISE, letterSpacing: '0.12em'}}>
          {label}
        </div>
        <div
          style={{
            fontFamily, fontSize: 20, fontWeight: 300, color: WHITE,
            letterSpacing: '0.01em', marginTop: 8, lineHeight: 1.4,
            opacity: taglineOpacity,
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
};
