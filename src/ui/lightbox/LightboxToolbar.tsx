import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { msClose, msZoomIn, msZoomOut } from "ui/material-symbols";
import LightboxButton from "ui/lightbox/LightboxButton";
import { useLightbox } from "ui/lightbox/lightbox-context";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, ZOOM_BUTTON_INCREMENT_SIZE } from "ui/lightbox/util";
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
        <div className="lightbox-toolbar">
            <ul className="lightbox-toolbar-side lightbox-toolbar-left-side">
                <li className="lightbox-toolbar-item">
                    <span className="lightbox-toolbar-item-child">
                        {statusText}
                    </span>
                </li>
            </ul>

            <ul className="lightbox-toolbar-side lightbox-toolbar-right-side">
                {toolbarButtons && toolbarButtons.map((button, i) =>
                    <li key={i} className="lightbox-toolbar-item">
                        {button}
                    </li>
                )}

                <li className="lightbox-toolbar-item">
                    <LightboxButton
                        title={t("zoom-in")}
                        icon={msZoomIn}
                        className="lightbox-zoom-button"
                        disabled={zoomLevel === MAX_ZOOM_LEVEL}
                        onClick={handleZoomInButtonClick}
                        ref={zoomInBtn}
                    />
                </li>

                <li className="lightbox-toolbar-item">
                    <LightboxButton
                        title={t("zoom-out")}
                        icon={msZoomOut}
                        className="lightbox-zoom-button"
                        disabled={zoomLevel === MIN_ZOOM_LEVEL}
                        onClick={handleZoomOutButtonClick}
                        ref={zoomOutBtn}
                    />
                </li>

                <li className="lightbox-toolbar-item">
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
