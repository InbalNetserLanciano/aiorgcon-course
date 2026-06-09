import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {TURQUOISE, WHITE, PURPLE, NAVY} from '../constants';

const {fontFamily} = loadFont('normal', {
  weights: ['300', '600', '700', '900'],
  subsets: ['latin'],
});

const PILLARS = ['IMPROVE', 'INTEGRATE', 'IMPACT'];

export const FrameworkReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Main title block fades + rises in
  const titleOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [5, 22], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Subtitle stagger
  const subOpacity = interpolate(frame, [18, 33], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
        pointerEvents: 'none',
      }}
    >
      {/* Centered panel */}
      <div
        style={{
          background: `linear-gradient(135deg, ${NAVY}f0 0%, ${PURPLE}cc 100%)`,
          border: `2px solid ${TURQUOISE}44`,
          borderRadius: 12,
          padding: '48px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          backdropFilter: 'blur(8px)',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {/* Top accent bar */}
        <div style={{width: 64, height: 3, background: TURQUOISE, borderRadius: 2}} />

        {/* Main heading */}
        <div
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: '0.06em',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          THE 3I FRAMEWORK
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 300,
            color: `${WHITE}bb`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center',
            opacity: subOpacity,
          }}
        >
          for HR AI Implementation
        </div>

        {/* Three pillars */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 8,
          }}
        >
          {PILLARS.map((label, i) => {
            const delay = 28 + i * 10;
            const pillarOpacity = interpolate(frame, [delay, delay + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const pillarY = interpolate(frame, [delay, delay + 14], [20, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <div
                key={label}
                style={{
                  opacity: pillarOpacity,
                  transform: `translateY(${pillarY}px)`,
                  background: `${TURQUOISE}18`,
                  border: `1.5px solid ${TURQUOISE}88`,
                  borderRadius: 8,
                  padding: '14px 28px',
                  fontFamily,
                  fontSize: 20,
                  fontWeight: 700,
                  color: TURQUOISE,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
