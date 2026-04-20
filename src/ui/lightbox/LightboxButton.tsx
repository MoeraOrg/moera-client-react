import React from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useLightbox } from "ui/lightbox/lightbox-context";
import "./LightboxButton.css";

interface Props {
    title: string;
    icon: MaterialSymbol;
    iconSize?: string | number;
    className?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    ref?: React.Ref<HTMLButtonElement>;
}

const LightboxButton = ({title, icon, iconSize = "1.5em", className, disabled, onClick, ref}: Props) => {
    const {animating} = useLightbox();

    return (
        <button
            type="button"
            aria-label={title}
            title={title}
            className={cx(
                "ril__toolbarItemChild",
                "ril__button",
                className,
                {
                    "ril__buttonDisabled": disabled
                }
            )}
            onClick={onClick}
            disabled={animating || disabled}
            ref={ref}
        >
            <Icon icon={icon} size={iconSize}/>
        </button>
    );
};

export default LightboxButton;
