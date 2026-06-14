import React from 'react';
import {Composition, CalculateMetadataFunction, staticFile} from 'remotion';
import {MainVideo, MainVideoProps, PanelTiming} from './MainVideo';
import {getAudioDuration} from './lib/get-audio-duration';
import {getVideoDuration} from './lib/get-video-duration';
import {PANELS, pad} from './data';
import {FPS, VIDEO_WIDTH, VIDEO_HEIGHT, VO_TAIL_SEC, FADE_FRAMES} from './constants';

const calculateMetadata: CalculateMetadataFunction<MainVideoProps> = async () => {
  const panelTimings: PanelTiming[] = await Promise.all(
    PANELS.map(async (panel) => {
      const n = pad(panel.panelIndex);
      const [audioDuration, videoDuration] = await Promise.all([
        getAudioDuration(staticFile(`voiceover/panel_${n}.mp3`)),
        getVideoDuration(staticFile(`animated/clip_${n}.mp4`)),
      ]);
      const targetSec = Math.min(audioDuration + VO_TAIL_SEC, videoDuration);
      const frames = Math.round(targetSec * FPS);
      return {panelIndex: panel.panelIndex, durationInFrames: frames, clipTrimFrames: frames};
    }),
  );

  const numTransitions = panelTimings.length - 1;
  const totalFrames =
    panelTimings.reduce((s, t) => s + t.durationInFrames, 0) - numTransitions * FADE_FRAMES;

  return {
    durationInFrames: totalFrames,
    fps: FPS,
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    props: {panelTimings},
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HRLeadsAI"
    component={MainVideo}
    fps={FPS}
    width={VIDEO_WIDTH}
    height={VIDEO_HEIGHT}
    durationInFrames={600}
    defaultProps={{
      panelTimings: PANELS.map((p) => ({
        panelIndex: p.panelIndex,
        durationInFrames: 150,
        clipTrimFrames: 150,
      })),
    }}
    calculateMetadata={calculateMetadata}
  />
);
