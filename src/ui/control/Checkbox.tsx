import React, { useEffect, useRef } from 'react';

type Props = {
    autoFocus?: boolean;
    checked: boolean | null;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "checked">;

export function Checkbox({autoFocus, checked, ...props}: Props) {
    const inputDom = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputDom.current != null) {
            inputDom.current.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        if (inputDom.current != null) {
            inputDom.current.indeterminate = checked === null
        }
    }, [checked]);

    return <input type="checkbox" checked={checked === true} ref={inputDom} {...props}/>;
}
