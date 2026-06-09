import React from 'react';
import {Composition, CalculateMetadataFunction, staticFile} from 'remotion';
import {MainVideo, MainVideoProps, PanelTiming} from './MainVideo';
import {getAudioDuration} from './lib/get-audio-duration';
import {getVideoDuration} from './lib/get-video-duration';
import {PANELS, pad} from './data';
import {FPS, VIDEO_WIDTH, VIDEO_HEIGHT, VO_TAIL_SEC, INTRO_DURATION_SEC, FADE_FRAMES} from './constants';

const calculateMetadata: CalculateMetadataFunction<MainVideoProps> = async ({
  abortSignal,
}) => {
  const introDurationFrames = Math.round(INTRO_DURATION_SEC * FPS);

  const panelTimings: PanelTiming[] = await Promise.all(
    PANELS.map(async (panel) => {
      const n = pad(panel.panelIndex);

      const [audioDuration, videoDuration] = await Promise.all([
        getAudioDuration(staticFile(`voiceover/panel_${n}.mp3`)),
        getVideoDuration(staticFile(`animated/clip_${n}.mp4`)),
      ]);

      // Scene ends 1.5s after VO, but never beyond original clip length
      const targetDurationSec = Math.min(audioDuration + VO_TAIL_SEC, videoDuration);
      const durationInFrames = Math.round(targetDurationSec * FPS);
      const clipTrimFrames = Math.round(targetDurationSec * FPS);

      return {
        panelIndex: panel.panelIndex,
        durationInFrames,
        clipTrimFrames,
      };
    }),
  );

  // Each transition overlaps two adjacent scenes by FADE_FRAMES.
  // There are panelTimings.length transitions (one after intro + one before each panel).
  const numTransitions = panelTimings.length;
  const totalFrames =
    introDurationFrames +
    panelTimings.reduce((sum, t) => sum + t.durationInFrames, 0) -
    numTransitions * FADE_FRAMES;

  return {
    durationInFrames: totalFrames,
    fps: FPS,
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    props: {
      introDurationFrames,
      panelTimings,
    },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ThreeIFramework"
      component={MainVideo}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      durationInFrames={300}
      defaultProps={{
        introDurationFrames: Math.round(INTRO_DURATION_SEC * FPS),
        panelTimings: PANELS.map((p) => ({
          panelIndex: p.panelIndex,
          durationInFrames: 150,
          clipTrimFrames: 150,
        })),
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};
