import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import avatarPlaceholder from "./avatar.png";
import { getSetting } from "state/settings/selectors";
import { getHomeRootPage } from "state/home/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { ClientState } from "state/state";
import { AvatarImage } from "api/node/api-types";
import "./Avatar.css";

function effectiveShape(shape: string | null, shapeLocal: string | null | undefined,
                        shapeGlobal: string): string | null {
    const shapeSetting = shapeLocal ?? shapeGlobal;
    return shapeSetting === "circle" || shapeSetting === "square" ? shapeSetting : shape;
}

function getRootPage(state: ClientState, nodeName: string | null): string | null {
    return nodeName
        ? (nodeName === ":" ? getHomeRootPage(state) : getNamingNameNodeUri(state, nodeName))
        : getNodeRootPage(state);
}

interface OwnProps {
    avatar: AvatarImage | null;
    size: number;
    shape?: string;
    className?: string;
    draggable?: boolean;
    nodeName: string | null;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onTouchStart?: () => void;
    imageRef?: React.Ref<HTMLImageElement>;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

export function AvatarImpl({avatar, size, shape: shapeLocal, className, draggable = true, onClick, onMouseEnter,
                            onMouseLeave, onTouchStart, imageRef, rootPage, shapeGlobal}: Props) {
    const {src, alt, shape} = avatar ? {
        src: `${rootPage}/media/${avatar.path}`,
        alt: "Avatar",
        shape: effectiveShape(avatar.shape ?? null, shapeLocal, shapeGlobal)
    } : {
        src: avatarPlaceholder,
        alt: "Avatar placeholder",
        shape: effectiveShape("circle", shapeLocal, shapeGlobal)
    };

    return (
        <img src={src} alt={alt} width={size} height={size} draggable={draggable} ref={imageRef} onClick={onClick}
             onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onTouchStart={onTouchStart}
             className={cx("avatar", `avatar-${shape}`, className)}/>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        rootPage: getRootPage(state, ownProps.nodeName),
        shapeGlobal: getSetting(state, "avatar.shape") as string
    })
);

export const Avatar = connector(AvatarImpl);
