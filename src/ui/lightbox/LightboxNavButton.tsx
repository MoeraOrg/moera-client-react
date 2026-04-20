import React from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useLightbox } from "ui/lightbox/lightbox-context";
import "./LightboxNavButton.css";

interface Props {
    title: string;
    icon: MaterialSymbol;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const LightboxNavButton = ({title, icon, className, onClick}: Props) => {
    const {animating} = useLightbox();

    return (
        <button
            type="button"
            aria-label={title}
            title={title}
            className={cx("ril__navButtons", className)}
            onClick={onClick}
            disabled={animating}
        >
            <Icon icon={icon} size={40}/>
        </button>
    );
};

export default LightboxNavButton;
