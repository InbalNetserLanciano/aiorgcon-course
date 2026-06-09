import {Config} from '@remotion/cli/config';

// Serve assets from the parent commercial folder so animated/, voiceover/,
// and storyboard/ are accessible via staticFile() without copying files.
Config.setPublicDir('../');
