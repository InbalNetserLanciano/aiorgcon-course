import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {IntroScene} from './scenes/IntroScene';
import {PanelScene} from './scenes/PanelScene';
import {PANELS, PanelConfig} from './data';
import {FADE_FRAMES} from './constants';

export interface PanelTiming {
  panelIndex: number;
  durationInFrames: number;
  clipTrimFrames: number;
}

export interface MainVideoProps {
  introDurationFrames: number;
  panelTimings: PanelTiming[];
}

export const MainVideo: React.FC<MainVideoProps> = ({
  introDurationFrames,
  panelTimings,
}) => {
  const panelMap = new Map<number, PanelConfig>(
    PANELS.map((p) => [p.panelIndex, p]),
  );

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Intro card */}
        <TransitionSeries.Sequence durationInFrames={introDurationFrames}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {panelTimings.map((timing, i) => {
          const panel = panelMap.get(timing.panelIndex)!;
          return (
            <React.Fragment key={timing.panelIndex}>
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({durationInFrames: FADE_FRAMES})}
              />
              <TransitionSeries.Sequence durationInFrames={timing.durationInFrames}>
                <PanelScene
                  panel={panel}
                  durationInFrames={timing.durationInFrames}
                  clipTrimFrames={timing.clipTrimFrames}
                />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
