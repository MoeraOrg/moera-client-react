import React from 'react';
import { useTranslation } from 'react-i18next';

import { msClose, msZoomIn, msZoomOut } from "ui/material-symbols";
import LightboxButton from "ui/react-image-lightbox/LightboxButton";
import "./LightboxToolbar.css";

interface Props {
    imageTitle?: string;
    toolbarButtons?: React.ReactNode[];
    animating: boolean;
    zoomInDisabled: boolean;
    zoomOutDisabled: boolean;
    onZoomIn(): void;
    onZoomOut(): void;
    onClose(event: React.MouseEvent<HTMLButtonElement>): void;
    zoomInRef?: React.Ref<HTMLButtonElement>;
    zoomOutRef?: React.Ref<HTMLButtonElement>;
}

export default function LightboxToolbar({
    imageTitle,
    toolbarButtons,
    animating,
    zoomInDisabled,
    zoomOutDisabled,
    onZoomIn,
    onZoomOut,
    onClose,
    zoomInRef,
    zoomOutRef
}: Props) {
    const {t} = useTranslation();

    return (
        <div className="ril__toolbar">
            <ul className="ril__toolbarSide ril__toolbarLeftSide">
                <li className="ril__toolbarItem">
                    <span className="ril__toolbarItemChild">
                        {imageTitle}
                    </span>
                </li>
            </ul>

            <ul className="ril__toolbarSide ril__toolbarRightSide">
                {toolbarButtons && toolbarButtons.map((button, i) =>
                    <li key={i} className="ril__toolbarItem">
                        {button}
                    </li>
                )}

                <LightboxButton
                    title={t("zoom-in")}
                    icon={msZoomIn}
                    className="ril__zoomButton"
                    disabled={zoomInDisabled}
                    animating={animating}
                    onClick={onZoomIn}
                    ref={zoomInRef}
                />

                <LightboxButton
                    title={t("zoom-out")}
                    icon={msZoomOut}
                    className="ril__zoomButton"
                    disabled={zoomOutDisabled}
                    animating={animating}
                    onClick={onZoomOut}
                    ref={zoomOutRef}
                />

                <LightboxButton
                    title={t("close")}
                    icon={msClose}
                    iconSize="1.75em"
                    animating={animating}
                    onClick={onClose}
                />
            </ul>
        </div>
    );
}
