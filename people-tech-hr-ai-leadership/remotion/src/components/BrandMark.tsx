import React from 'react';
import {loadFont} from '@remotion/google-fonts/Montserrat';
import {TURQUOISE, WHITE} from '../constants';

const {fontFamily} = loadFont('normal', {weights: ['400'], subsets: ['latin']});

export const BrandMark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 32,
      right: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 2,
      opacity: 0.55,
    }}
  >
    <div
      style={{
        fontFamily,
        fontSize: 14,
        fontWeight: 400,
        color: WHITE,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      People Tech Consulting Solutions
    </div>
    <div style={{width: 80, height: 1.5, background: TURQUOISE, borderRadius: 1}} />
  </div>
);
