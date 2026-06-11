import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {PURPLE, TURQUOISE, WHITE, NAVY} from '../constants';

const {fontFamily} = loadFont('normal', {
  weights: ['300', '700', '900'],
  subsets: ['latin'],
});

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 5],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Brand name fade + rise
  const nameOpacity = interpolate(frame, [8, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nameY = interpolate(frame, [8, 25], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Tagline stagger
  const tagOpacity = interpolate(frame, [22, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse ring — scale expands once
  const ringScale = interpolate(frame, [0, 40], [0.6, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const ringOpacity = interpolate(frame, [0, 20, 40], [0.6, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Horizontal accent line width
  const lineWidth = interpolate(frame, [15, 30], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 40% 45%, ${PURPLE}cc 0%, ${NAVY} 65%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Pulse ring */}
      <div
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          border: `2px solid ${TURQUOISE}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 42,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          People Tech
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 300,
            color: `${WHITE}aa`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Consulting Solutions
        </div>

        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: TURQUOISE,
            borderRadius: 1,
            marginTop: 4,
          }}
        />

        <div
          style={{
            fontFamily,
            fontSize: 16,
            fontWeight: 300,
            color: `${TURQUOISE}cc`,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            opacity: tagOpacity,
            marginTop: 2,
          }}
        >
          Inbal Netser Lanciano
        </div>
      </div>
    </div>
  );
};
