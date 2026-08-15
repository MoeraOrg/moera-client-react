import React, { type CSSProperties, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { createPlayer, Gesture, selectControls } from '@videojs/react';
import { MinimalVideoSkin, Video, videoFeatures } from '@videojs/react/video';

import { Loading } from "ui/control";
import { useLightbox } from "ui/lightbox/lightbox-context";
import { ANIMATION_DURATION_MS } from "ui/lightbox/util";
import "./LightboxVideo.css";

const Player = createPlayer({features: videoFeatures});

interface Props {
    src: string;
    posterSrc: string | undefined;
    width: number | undefined;
    height: number | undefined;
    className?: string;
    autoPlay?: boolean;
    transforms: {
        x?: number;
        y?: number;
    };
}

export default function LightboxVideo({src, posterSrc, width, height, className, autoPlay, transforms}: Props) {
    const {animating, boxSize, setDyed} = useLightbox();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [naturalSize, setNaturalSize] = useState<VideoSize | null>(
        width != null && height != null ? {width, height} : null
    );

    const isMain = className?.includes("lightbox-video-main");

    useEffect(() => {
        if (!isMain) {
            videoRef.current?.pause();
            return;
        }

        return () => setDyed(false);
    }, [isMain, setDyed]);

    const onLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>): void => {
        const video = event.currentTarget;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            setNaturalSize({width: video.videoWidth, height: video.videoHeight});
        }
    };

    const size = naturalSize != null
        ? getFitSize(boxSize.width, boxSize.height, naturalSize)
        : {width: 0, height: 0};
    const style: CSSProperties = {
        width: size.width,
        height: size.height,
        transform: `translate3d(${transforms.x ?? 0}px,${transforms.y ?? 0}px,0)`,
        ...(animating ? {transition: `transform ${ANIMATION_DURATION_MS}ms`} : {})
    };

    return (
        <>
            {naturalSize == null && isMain &&
                <div className="lightbox-video-loading">
                    <Loading overlay/>
                </div>
            }
            <div
                className={cx(className, "lightbox-video")}
                style={style}
                aria-hidden={!isMain}
                inert={!isMain}
            >
                <Player.Provider>
                    <MinimalVideoSkin className="lightbox-video-player">
                        <Video
                            src={src}
                            poster={posterSrc}
                            autoPlay={autoPlay}
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={onLoadedMetadata}
                            onPlay={() => setDyed(true)}
                            onPause={() => setDyed(false)}
                            onEnded={() => setDyed(false)}
                            ref={videoRef}
                        />
                        <TouchPlaybackGesture/>
                    </MinimalVideoSkin>
                </Player.Provider>
            </div>
        </>
    );
}

interface VideoSize {
    width: number;
    height: number;
}

function getFitSize(containerWidth: number, containerHeight: number, naturalSize: VideoSize): VideoSize {
    const maxWidth = Math.max(0, containerWidth - 20);
    const maxHeight = Math.max(0, containerHeight - 20);
    const scale = Math.min(1, maxWidth / naturalSize.width, maxHeight / naturalSize.height);

    return {
        width: naturalSize.width * scale,
        height: naturalSize.height * scale
    };
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
