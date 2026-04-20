import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { msClose, msZoomIn, msZoomOut } from "ui/material-symbols";
import LightboxButton from "ui/react-image-lightbox/LightboxButton";
import { useLightbox } from "ui/react-image-lightbox/lightbox-context";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, ZOOM_BUTTON_INCREMENT_SIZE } from "ui/react-image-lightbox/util";
import "./LightboxToolbar.css";

interface Props {
    statusText?: string;
    toolbarButtons?: React.ReactNode[];
    onClose(event: React.MouseEvent<HTMLButtonElement>): void;
}

export default function LightboxToolbar({statusText, toolbarButtons, onClose}: Props) {
    const {zoomLevel, changeZoom} = useLightbox();
    const {t} = useTranslation();

    const zoomInBtn = useRef<HTMLButtonElement | null>(null);
    const zoomOutBtn = useRef<HTMLButtonElement | null>(null);

    const handleZoomInButtonClick = (): void => {
        const nextZoomLevel = Math.min(MAX_ZOOM_LEVEL, zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE);
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MAX_ZOOM_LEVEL && zoomOutBtn.current) {
            zoomOutBtn.current.focus();
        }
    };

    const handleZoomOutButtonClick = (): void => {
        const nextZoomLevel = Math.max(MIN_ZOOM_LEVEL, zoomLevel - ZOOM_BUTTON_INCREMENT_SIZE);
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MIN_ZOOM_LEVEL && zoomInBtn.current) {
            zoomInBtn.current.focus();
        }
    };

    return (
        <div className="ril__toolbar">
            <ul className="ril__toolbarSide ril__toolbarLeftSide">
                <li className="ril__toolbarItem">
                    <span className="ril__toolbarItemChild">
                        {statusText}
                    </span>
                </li>
            </ul>

            <ul className="ril__toolbarSide ril__toolbarRightSide">
                {toolbarButtons && toolbarButtons.map((button, i) =>
                    <li key={i} className="ril__toolbarItem">
                        {button}
                    </li>
                )}

                <li className="ril__toolbarItem">
                    <LightboxButton
                        title={t("zoom-in")}
                        icon={msZoomIn}
                        className="ril__zoomButton"
                        disabled={zoomLevel === MAX_ZOOM_LEVEL}
                        onClick={handleZoomInButtonClick}
                        ref={zoomInBtn}
                    />
                </li>

                <li className="ril__toolbarItem">
                    <LightboxButton
                        title={t("zoom-out")}
                        icon={msZoomOut}
                        className="ril__zoomButton"
                        disabled={zoomLevel === MIN_ZOOM_LEVEL}
                        onClick={handleZoomOutButtonClick}
                        ref={zoomOutBtn}
                    />
                </li>

                <li className="ril__toolbarItem">
                    <LightboxButton
                        title={t("close")}
                        icon={msClose}
                        iconSize="1.75em"
                        onClick={onClose}
                    />
                </li>
            </ul>
        </div>
    );
}
