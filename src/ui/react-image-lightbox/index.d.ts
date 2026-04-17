import * as React from "react";

export type LightboxTriggerEvent = Event | React.SyntheticEvent;

export type LightboxImageSourceName =
    | "mainSrc"
    | "mainSrcThumbnail"
    | "nextSrc"
    | "nextSrcThumbnail"
    | "prevSrc"
    | "prevSrcThumbnail";

export interface LightboxProps {
    mainSrc: string;
    nextSrc?: string | null;
    prevSrc?: string | null;
    mainSrcThumbnail?: string | null;
    prevSrcThumbnail?: string | null;
    nextSrcThumbnail?: string | null;
    onCloseRequest(event?: LightboxTriggerEvent): void;
    onMovePrevRequest?(event?: LightboxTriggerEvent): void;
    onMoveNextRequest?(event?: LightboxTriggerEvent): void;
    onImageLoad?(
        imageSrc: string,
        srcType: LightboxImageSourceName,
        image: HTMLImageElement
    ): void;
    onImageLoadError?(
        imageSrc: string,
        srcType: LightboxImageSourceName,
        errorEvent: Event
    ): void;
    imageLoadErrorMessage?: React.ReactNode;
    onAfterOpen?(): void;
    discourageDownloads?: boolean;
    animationDisabled?: boolean;
    animationOnKeyInput?: boolean;
    animationDuration?: number;
    keyRepeatLimit?: number;
    keyRepeatKeyupBonus?: number;
    imageTitle?: React.ReactNode;
    imageCaption?: React.ReactNode;
    imageCrossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>["crossOrigin"] | null;
    toolbarButtons?: React.ReactNode[] | null;
    reactModalStyle?: {
        overlay?: React.CSSProperties;
        content?: React.CSSProperties;
    };
    reactModalProps?: Record<string, unknown>;
    imagePadding?: number;
    clickOutsideToClose?: boolean;
    enableZoom?: boolean;
    wrapperClassName?: string;
    nextLabel?: string;
    prevLabel?: string;
    zoomInLabel?: string;
    zoomOutLabel?: string;
    closeLabel?: string;
    loader?: React.ReactNode | undefined;
}

export interface ILightBoxProps extends LightboxProps {}

declare const Lightbox: React.ComponentType<LightboxProps> & {
    getTransform(args: {
        targetWidth: number;
        width: number;
        x?: number;
        y?: number;
        zoom?: number;
    }): React.CSSProperties;
    isTargetMatchImage(target: EventTarget | null): boolean;
    parseMouseEvent(mouseEvent: { clientX: number; clientY: number }): {
        id: number | string;
        source: number;
        x: number;
        y: number;
    };
    parsePointerEvent(pointerEvent: PointerEvent): {
        id: number | string;
        source: number;
        x: number;
        y: number;
    };
    parseTouchPointer(touchPointer: {
        identifier: number;
        clientX: number;
        clientY: number;
    }): {
        id: number | string;
        source: number;
        x: number;
        y: number;
    };
};

export default Lightbox;
