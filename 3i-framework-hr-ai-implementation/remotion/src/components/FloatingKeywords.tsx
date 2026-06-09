import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {TURQUOISE, WHITE, PURPLE} from '../constants';
import {CHALLENGE_KEYWORDS} from '../data';

const {fontFamily} = loadFont('normal', {
  weights: ['300', '600'],
  subsets: ['latin'],
});

// Fixed positions for 8 keywords — spread across the frame without overlapping
// the lower 25% (reserved for lower-third text)
const KEYWORD_POSITIONS: {x: number; y: number}[] = [
  {x: 12,  y: 12},
  {x: 58,  y: 8},
  {x: 22,  y: 38},
  {x: 68,  y: 30},
  {x: 8,   y: 58},
  {x: 45,  y: 52},
  {x: 75,  y: 55},
  {x: 32,  y: 65},
];

export const FloatingKeywords: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const sceneOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* Floating keywords */}
      {CHALLENGE_KEYWORDS.map((word, i) => {
        const delay = i * 8 + 5;
        const opacity = interpolate(frame, [delay, delay + 18], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const drift = interpolate(frame, [delay, delay + 18], [12, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const pos = KEYWORD_POSITIONS[i];
        return (
          <div
            key={word}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              opacity: opacity * sceneOut,
              transform: `translateY(${drift}px)`,
              fontFamily,
              fontSize: 28,
              fontWeight: 600,
              color: TURQUOISE,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
            }}
          >
            {word}
          </div>
        );
      })}

      {/* Lower-third challenge text */}
      <LowerThirdChallenge frame={frame} durationInFrames={durationInFrames} />
    </div>
  );
};

const LowerThirdChallenge: React.FC<{frame: number; durationInFrames: number}> = (
  {frame, durationInFrames},
) => {
  const slideIn = interpolate(frame, [20, 38], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [20, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const line2Opacity = interpolate(frame, [30, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 80px 64px',
        opacity: Math.min(opacity, fadeOut),
        transform: `translateY(${slideIn}px)`,
      }}
    >
      <div style={{width: 48, height: 3, background: TURQUOISE, borderRadius: 2, marginBottom: 12}} />
      <div
        style={{
          background: `linear-gradient(90deg, ${PURPLE}ee 0%, ${PURPLE}99 60%, transparent 100%)`,
          padding: '18px 32px',
          borderLeft: `3px solid ${TURQUOISE}`,
          backdropFilter: 'blur(4px)',
          display: 'inline-block',
          minWidth: 520,
        }}
      >
        <div style={{fontFamily, fontSize: 30, fontWeight: 300, color: WHITE, letterSpacing: '0.02em'}}>
          The challenge is not choosing a tool.
        </div>
        <div
          style={{
            fontFamily, fontSize: 36, fontWeight: 700, color: WHITE,
            letterSpacing: '0.01em', marginTop: 4, opacity: line2Opacity,
          }}
        >
          The challenge is designing the work.
        </div>
      </div>
    </div>
  );
};
