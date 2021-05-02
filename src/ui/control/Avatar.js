import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import avatarPlaceholder from "./avatar.png";
import { getSetting } from "state/settings/selectors";
import "./Avatar.css";

function effectiveShape(shape, shapeLocal, shapeGlobal) {
    const shapeSetting = shapeLocal ?? shapeGlobal;
    return shapeSetting === "circle" || shapeSetting === "square" ? shapeSetting : shape;
}

export function AvatarImpl({avatar, size, shape: shapeLocal, className, draggable, rootPage, onClick, shapeGlobal}) {
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
        <img src={src} alt={alt} width={size} height={size} draggable={draggable} onClick={onClick}
             className={cx("avatar", `avatar-${shape}`, className)}/>
    );
}

export const Avatar = connect(
    state => ({
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
    rootPage: PropType.string,
    onClick: PropType.func
}
Avatar.defaultProps = {
    draggable: true
}
