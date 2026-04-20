import React from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useLightbox } from "ui/react-image-lightbox/lightbox-context";
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
        <li className="ril__toolbarItem">
            <button
                type="button"
                aria-label={title}
                title={title}
                className={cx(
                    "ril__toolbarItemChild",
                    "ril__builtinButton",
                    className,
                    {
                        "ril__builtinButtonDisabled": disabled
                    }
                )}
                onClick={onClick}
                disabled={animating || disabled}
                ref={ref}
            >
                <Icon icon={icon} size={iconSize}/>
            </button>
        </li>
    );
};

export default LightboxButton;
