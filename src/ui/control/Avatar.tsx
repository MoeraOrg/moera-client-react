import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { AvatarImage } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import avatarPlaceholder from "./avatar.png";
import "./Avatar.css";

function effectiveShape(shape: string | null, shapeLocal: string | null | undefined,
                        shapeGlobal: string): string | null {
    const shapeSetting = shapeLocal ?? shapeGlobal;
    return shapeSetting === "circle" || shapeSetting === "square" ? shapeSetting : shape;
}

function nameAngle(ownerName: string | null | undefined): number {
    if (ownerName == null) {
        return 0;
    }

    let angle = 0;
    for (let i = 0; i < ownerName.length; i++) {
        angle = (angle + ownerName.charCodeAt(i)) % 12;
    }

    return angle * 360 / 12;
}

function getRootPage(state: ClientState, nodeName: string | null | undefined): string | null {
    return nodeName
        ? (nodeName === ":" ? getHomeRootPage(state) : getNamingNameNodeUri(state, nodeName))
        : getNodeRootPage(state);
}

interface Props {
    avatar: AvatarImage | null | undefined;
    ownerName: string | null | undefined; // Node that owns the avatar
    size: number;
    shape?: string;
    className?: string;
    draggable?: boolean;
    nodeName?: string | null; // Node the avatar is loaded from
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onTouchStart?: () => void;
    imageRef?: React.Ref<HTMLImageElement>;
}

export function Avatar({
    avatar, ownerName, size, shape: shapeLocal, className, draggable = true, nodeName, onClick, onMouseEnter,
    onMouseLeave, onTouchStart, imageRef
}: Props) {
    const rootPage = useSelector((state: ClientState) => getRootPage(state, nodeName));
    const shapeGlobal = useSelector((state: ClientState) => getSetting(state, "avatar.shape") as string);
    const {t} = useTranslation();

    if (window.loadedAvatars == null) {
        window.loadedAvatars = new Map<string, string>();
    }

    let src: string, alt: string, shape: string | null, style: React.CSSProperties | undefined;
    if (avatar != null) {
        src = window.loadedAvatars.get(avatar.path) ?? `${rootPage}/media/${avatar.path}`;
        window.loadedAvatars.set(avatar.path, src);
        alt = t("avatar");
        shape = effectiveShape(avatar.shape ?? null, shapeLocal, shapeGlobal);
        style = undefined;
    } else {
        src = avatarPlaceholder;
        alt = t("avatar-placeholder");
        shape = effectiveShape("circle", shapeLocal, shapeGlobal);
        style = {filter: `hue-rotate(${nameAngle(ownerName)}deg)`};
    }

    return (
        <img src={src} alt={alt} width={size} height={size} draggable={draggable} ref={imageRef} onClick={onClick}
             onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onTouchStart={onTouchStart}
             className={cx("avatar", `avatar-${shape}`, className)} style={style}/>
    );
}
