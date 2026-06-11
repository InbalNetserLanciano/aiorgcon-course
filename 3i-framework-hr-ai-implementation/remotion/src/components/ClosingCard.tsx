import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {TURQUOISE, WHITE, PURPLE, NAVY} from '../constants';

const {fontFamily} = loadFont('normal', {
  weights: ['300', '400', '600', '700', '900'],
  subsets: ['latin'],
});

// Each line: [startFrame, text, weight, size, color]
const LINES: [number, string, number, number, string][] = [
  [5,  'People × Data × Technology × Goals', 300, 22, `${WHITE}99`],
  [18, 'From AI Tools', 700, 38, WHITE],
  [28, 'to Organizational Transformation', 300, 32, WHITE],
  [40, 'THE 3I FRAMEWORK', 900, 46, TURQUOISE],
  [52, 'for HR AI Implementation', 400, 22, `${WHITE}bb`],
];

export const ClosingCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

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
      <div
        style={{
          background: `linear-gradient(160deg, ${NAVY}e8 0%, ${PURPLE}bb 100%)`,
          border: `1.5px solid ${TURQUOISE}33`,
          borderRadius: 16,
          padding: '56px 88px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          backdropFilter: 'blur(10px)',
          maxWidth: 900,
        }}
      >
        {/* Accent bar at top */}
        <div style={{width: 64, height: 3, background: TURQUOISE, borderRadius: 2, marginBottom: 12}} />

        {LINES.map(([startFrame, text, weight, size, color]) => {
          const opacity = interpolate(frame, [startFrame, startFrame + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [startFrame, startFrame + 14], [18, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={text}
              style={{
                fontFamily,
                fontSize: size,
                fontWeight: weight,
                color: color,
                letterSpacing: weight >= 700 ? '0.08em' : '0.02em',
                textAlign: 'center',
                opacity,
                transform: `translateY(${y}px)`,
                lineHeight: 1.2,
              }}
            >
              {text}
            </div>
          );
        })}

        {/* Bottom accent */}
        <div style={{width: 48, height: 2, background: `${TURQUOISE}66`, borderRadius: 2, marginTop: 16}} />
      </div>
    </div>
  );
};
