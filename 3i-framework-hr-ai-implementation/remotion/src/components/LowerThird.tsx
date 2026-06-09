import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {PURPLE, TURQUOISE, WHITE} from '../constants';

const {fontFamily} = loadFont('normal', {
  weights: ['300', '600', '700'],
  subsets: ['latin'],
});

interface LowerThirdProps {
  line1: string;
  line2?: string;
}

export const LowerThird: React.FC<LowerThirdProps> = ({line1, line2}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const slideIn = interpolate(frame, [12, 30], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(frame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out 20 frames before scene ends
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const line2Opacity = interpolate(frame, [22, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const combinedOpacity = Math.min(opacity, fadeOut);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: combinedOpacity,
        transform: `translateY(${slideIn}px)`,
        padding: '0 80px 64px',
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: 48,
          height: 3,
          background: TURQUOISE,
          borderRadius: 2,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          background: `linear-gradient(90deg, ${PURPLE}ee 0%, ${PURPLE}99 60%, transparent 100%)`,
          padding: '18px 32px',
          borderLeft: `3px solid ${TURQUOISE}`,
          backdropFilter: 'blur(4px)',
          display: 'inline-block',
          minWidth: 480,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: line2 ? 32 : 38,
            fontWeight: 300,
            color: WHITE,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
        >
          {line1}
        </div>
        {line2 && (
          <div
            style={{
              fontFamily,
              fontSize: 38,
              fontWeight: 700,
              color: WHITE,
              letterSpacing: '0.01em',
              marginTop: 4,
              opacity: line2Opacity,
            }}
          >
            {line2}
          </div>
        )}
      </div>
    </div>
  );
};
