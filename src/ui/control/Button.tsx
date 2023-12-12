import React, { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import composeRefs from '@seznam/compose-react-refs';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { LoadingInline } from "ui/control";

type Props = {
    variant: string;
    size?: "sm" | "lg";
    compact?: boolean;
    block?: boolean;
    borderless?: boolean;
    invisible?: boolean;
    active?: boolean;
    loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ButtonImpl(
    {
        variant, size, compact = false, block = false, borderless = false, invisible = false, active = false,
        loading = false, disabled = false, className = "", type = "button", autoFocus, ...props
    }: Props,
    ref: ForwardedRef<HTMLButtonElement>
) {
    const domRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (autoFocus && domRef.current != null) {
            domRef.current.focus();
        }
    }, [domRef, autoFocus]);

    const klass = cx(
        "btn",
        `btn-${variant}`, {
            "btn-sm": size === "sm",
            "btn-lg": size === "lg",
            "flex-fill": block,
            "border-0": borderless,
            "invisible": invisible,
            "active": active
        },
        className
    );

    return (
        <button type={type} className={klass} disabled={loading || disabled} {...props}
                ref={composeRefs(domRef, ref)}>
            {!(loading && (compact || Browser.isTinyScreen())) &&
                <>{props.children}</>
            }
            {loading && <LoadingInline/>}
        </button>
    );
}
const Button = forwardRef(ButtonImpl);

export { Button };
