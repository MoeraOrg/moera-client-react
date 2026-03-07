import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ANONYMOUS_NODE_NAME, AvatarImage, NodeName } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getSetting } from "state/settings/selectors";
import { REL_CURRENT, REL_SEARCH, RelNodeName } from "util/rel-node-name";
import "./Avatar.css";

function effectiveShape(
    shape: string | null, shapeLocal: string | null | undefined, shapeGlobal: string
): string | null {
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

interface Props {
    avatar: AvatarImage | null | undefined;
    ownerName: string | null | undefined; // Node that owns the avatar
    size: number;
    shape?: string;
    className?: string;
    draggable?: boolean;
    nodeName?: RelNodeName | string; // Node the avatar is loaded from
    onClick?: (event: React.MouseEvent) => void;
    ref?: React.Ref<HTMLImageElement>;
}

export function Avatar(
    {
        avatar, ownerName, size, shape: shapeLocal, className, draggable = true, nodeName = REL_CURRENT, onClick, ref
    }: Props
) {
    const rootPage = useSelector((state: ClientState) =>
        getNamingNameRoot(state, nodeName)
        ?? getNamingNameRoot(state, ownerName ?? REL_SEARCH)
        ?? getNamingNameRoot(state, REL_SEARCH)
    );
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
        return (
            <img src={src} alt={alt} width={size} height={size} draggable={draggable} ref={ref} onClick={onClick}
                 className={cx("avatar", `avatar-${shape}`, className)} style={style}/>
        );
    } else {
        const anonymous = ownerName == null || ownerName === ANONYMOUS_NODE_NAME;
        shape = effectiveShape("circle", shapeLocal, shapeGlobal);
        style = {
            width: `${size}px`,
            height: `${size}px`,
            fontSize: `${size / 3}px`,
            filter: !anonymous ? `hue-rotate(${nameAngle(ownerName)}deg)` : "grayscale(100%) brightness(110%)"
        };
        const shortName = !anonymous ? NodeName.shorten(ownerName) : "\u2205";
        return (
            <div draggable={draggable} ref={ref} onClick={onClick}
                 className={cx("avatar", `avatar-${shape}`, "avatar-placeholder", className)} style={style}>
                {(shortName ?? "XX").substring(0, 2).toUpperCase()}
            </div>
        );
    }
}
