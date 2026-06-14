import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {PanelScene} from './scenes/PanelScene';
import {PANELS, PanelConfig} from './data';
import {FADE_FRAMES} from './constants';

export interface PanelTiming {
  panelIndex: number;
  durationInFrames: number;
  clipTrimFrames: number;
}

export interface MainVideoProps {
  panelTimings: PanelTiming[];
}

export const MainVideo: React.FC<MainVideoProps> = ({panelTimings}) => {
  const panelMap = new Map<number, PanelConfig>(PANELS.map((p) => [p.panelIndex, p]));

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {panelTimings.map((timing, i) => {
          const panel = panelMap.get(timing.panelIndex)!;
          return (
            <React.Fragment key={timing.panelIndex}>
              {i > 0 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({durationInFrames: FADE_FRAMES})}
                />
              )}
              <TransitionSeries.Sequence durationInFrames={timing.durationInFrames}>
                <PanelScene panel={panel} clipTrimFrames={timing.clipTrimFrames} />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
