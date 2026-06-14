import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {TURQUOISE, WHITE, GREY, NAVY, PURPLE} from '../constants';

const {fontFamily} = loadFont('normal', {weights: ['300', '400', '700', '900'], subsets: ['latin']});

const LINES: {text: string; weight: number; size: number; color: string; startFrame: number}[] = [
  {text: 'This is the work HR was built for.',  weight: 700, size: 44, color: WHITE,     startFrame: 5},
  {text: "Let's begin.",                        weight: 900, size: 52, color: TURQUOISE,  startFrame: 22},
  {text: 'People Tech Consulting Solutions',    weight: 400, size: 20, color: WHITE,     startFrame: 36},
  {text: 'Inbal Netser Lanciano',               weight: 300, size: 17, color: GREY,      startFrame: 40},
  {text: 'inbalnl@ptc-s.com  ·  +972(0)524242925', weight: 300, size: 15, color: WHITE, startFrame: 44},
  {text: '3i-framework.ptc-s.com',             weight: 400, size: 17, color: TURQUOISE,  startFrame: 48},
];

export const BrandCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 35% 50%, ${PURPLE}cc 0%, ${NAVY} 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          maxWidth: 860,
          textAlign: 'center',
        }}
      >
        <div style={{width: 56, height: 3, background: TURQUOISE, borderRadius: 2, marginBottom: 16}} />

        {LINES.map(({text, weight, size, color, startFrame}) => {
          const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [startFrame, startFrame + 12], [16, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={text}
              style={{
                fontFamily, fontSize: size, fontWeight: weight, color,
                letterSpacing: weight >= 700 ? '0.06em' : '0.02em',
                lineHeight: 1.2, opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
