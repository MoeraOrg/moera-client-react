import React from 'react';

import { Icon, msPlayCircleFilled } from "ui/material-symbols";
import { useIsTinyScreen } from "ui/hook";
import "./VideoDuration.css";

interface Props {
    duration?: number | null;
}

function formatDuration(duration: number): string {
    const totalSeconds = Math.trunc(duration);
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    const totalMinutes = Math.trunc(totalSeconds / 60);
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");

    if (totalMinutes < 60) {
        return `${minutes}:${seconds}`;
    }

    const hours = Math.trunc(totalMinutes / 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

export function VideoDuration({duration}: Props) {
    const tinyScreen = useIsTinyScreen();

    return (
        <div className="video-duration">
            <Icon icon={msPlayCircleFilled} size={!tinyScreen ? 20 : 16}/>
            <span>{formatDuration(duration ?? 0)}</span>
        </div>
    );
}
