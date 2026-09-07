import { useVideoPlayer, VideoView } from 'expo-video';
import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';

export interface MediaCardBackgroundVideoProps {
  /** Remote or local video URI. */
  source: string;
  /** Pause playback (e.g. when off-screen). @default false */
  paused?: boolean;
  testID?: string;
}

/**
 * Full-bleed looping muted video for {@link EtMediaCard} backgrounds.
 */
function MediaCardBackgroundVideoComponent({ source, paused = false, testID }: MediaCardBackgroundVideoProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    if (paused) {
      player.pause();
    } else {
      player.play();
    }
  }, [paused, player]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFillObject}
      contentFit="cover"
      nativeControls={false}
      testID={testID ?? 'media-card-background-video'}
    />
  );
}

export const MediaCardBackgroundVideo = memo(MediaCardBackgroundVideoComponent);
MediaCardBackgroundVideo.displayName = 'MediaCardBackgroundVideo';
