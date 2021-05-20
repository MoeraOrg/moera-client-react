import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import avatarPlaceholder from "./avatar.png";
import { getSetting } from "state/settings/selectors";
import { getHomeRootPage } from "state/home/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import "./Avatar.css";

function effectiveShape(shape, shapeLocal, shapeGlobal) {
    const shapeSetting = shapeLocal ?? shapeGlobal;
    return shapeSetting === "circle" || shapeSetting === "square" ? shapeSetting : shape;
}

function getRootPage(state, nodeName) {
    return nodeName
        ? (nodeName === ":" ? getHomeRootPage(state) : getNamingNameNodeUri(state, nodeName))
        : getNodeRootPage(state);
}

export function AvatarImpl({avatar, size, shape: shapeLocal, className, draggable, onClick, onMouseEnter, onMouseLeave,
                            onTouchStart, imageRef, rootPage, shapeGlobal}) {
    const {src, alt, shape} = avatar ? {
        src: `${rootPage}/media/${avatar.path}`,
        alt: "Avatar",
        shape: effectiveShape(avatar.shape, shapeLocal, shapeGlobal)
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

export const Avatar = connect(
    (state, ownProps) => ({
        rootPage: getRootPage(state, ownProps.nodeName),
        shapeGlobal: getSetting(state, "avatar.shape")
    })
)(AvatarImpl);

Avatar.propTypes = {
    avatar: PropType.shape({
        path: PropType.string,
        shape: PropType.string
    }),
    size: PropType.number,
    shape: PropType.string,
    className: PropType.string,
    draggable: PropType.bool,
    nodeName: PropType.string,
    onClick: PropType.func,
    onMouseEnter: PropType.func,
    onMouseLeave: PropType.func,
    onTouchStart: PropType.func,
    imageRef: PropType.any
}

Avatar.defaultProps = {
    draggable: true
}
