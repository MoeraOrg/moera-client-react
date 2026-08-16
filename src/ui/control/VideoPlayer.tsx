import React from 'react';
import { createPlayer, Gesture, selectControls } from '@videojs/react';
import { MinimalVideoSkin, Video, type VideoProps, videoFeatures } from '@videojs/react/video';
import '@videojs/react/video/minimal-skin.css';

const Player = createPlayer({features: videoFeatures.filter(({name}) => name !== "pip")});

interface Props extends Omit<VideoProps, "className" | "disablePictureInPicture" | "playsInline" | "preload"> {
    className?: string;
    ref?: React.Ref<HTMLVideoElement>;
}

export function VideoPlayer({className, ref, ...props}: Props) {
    return (
        <Player.Provider>
            <MinimalVideoSkin className={className}>
                <Video
                    {...props}
                    disablePictureInPicture
                    playsInline
                    preload="metadata"
                    ref={ref}
                />
                <TouchPlaybackGesture/>
            </MinimalVideoSkin>
        </Player.Provider>
    );
}

function TouchPlaybackGesture() {
    const controlsVisible = Player.usePlayer(selectControls)?.controlsVisible ?? false;

    return (
        <Gesture
            type="tap"
            action="togglePaused"
            pointer="touch"
            region="center"
            disabled={!controlsVisible}
        />
    );
}
