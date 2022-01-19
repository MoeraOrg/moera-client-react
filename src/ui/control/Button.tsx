import React, { useEffect, useRef } from 'react';
import composeRefs from '@seznam/compose-react-refs';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { LoadingInline } from "ui/control";

type Props = {
    variant: string;
    size?: "sm" | "lg";
    block?: boolean;
    invisible?: boolean;
    loading?: boolean;
    innerRef?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({variant, size, block = false, invisible = false, loading = false, disabled = false,
                        className = "", type = "button", autoFocus, innerRef, ...props}: Props) {
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
            "invisible": invisible
        },
        className
    );

    return (
        <button type={type} className={klass} disabled={loading || disabled} {...props}
                ref={composeRefs(domRef, innerRef)}>
            <LoadingInline active={loading}/>
            {!(loading && Browser.isTinyScreen()) &&
                <>{props.children}{loading && "…"}</>
            }
        </button>
    );
}
