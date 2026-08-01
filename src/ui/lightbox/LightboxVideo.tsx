import React, { type CSSProperties, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { createPlayer } from '@videojs/react';
import { MinimalVideoSkin, Video, videoFeatures } from '@videojs/react/video';
import '@videojs/react/video/minimal-skin.css';

import { Loading } from "ui/control";
import { useIsTinyScreen } from "ui/hook";
import { useLightbox } from "ui/lightbox/lightbox-context";
import "./LightboxVideo.css";

const Player = createPlayer({features: videoFeatures});

interface Props {
    src: string;
    className?: string;
    autoPlay?: boolean;
}

export default function LightboxVideo({src, className, autoPlay}: Props) {
    const {boxSize, setDyed} = useLightbox();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [naturalSize, setNaturalSize] = useState<VideoSize | null>(null);
    const tinyScreen = useIsTinyScreen();

    const isMain = className?.includes("lightbox-video-main");

    useEffect(() => {
        if (!isMain) {
            videoRef.current?.pause();
            return;
        }

        return () => setDyed(false);
    }, [isMain, setDyed]);

    const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>): void => {
        const video = event.currentTarget;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            setNaturalSize({width: video.videoWidth, height: video.videoHeight});
        }
    };

    const size = naturalSize != null
        ? getFitSize(boxSize.width, boxSize.height, naturalSize, tinyScreen)
        : {width: 0, height: 0};
    const style: CSSProperties = {
        width: size.width,
        height: size.height
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
                            autoPlay={autoPlay}
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={() => setDyed(true)}
                            onPause={() => setDyed(false)}
                            onEnded={() => setDyed(false)}
                            ref={videoRef}
                        />
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

function getFitSize(
    containerWidth: number, containerHeight: number, naturalSize: VideoSize, tinyScreen: boolean
): VideoSize {
    const padding = !tinyScreen ? 60 : 10;
    const maxWidth = Math.max(0, containerWidth - padding * 2);
    const maxHeight = Math.max(0, containerHeight - padding * 2);
    const scale = Math.min(1, maxWidth / naturalSize.width, maxHeight / naturalSize.height);

    return {
        width: naturalSize.width * scale,
        height: naturalSize.height * scale
    };
}
