import React, { useEffect, useState } from 'react';
import { PulseLoader } from "react-spinners";
import cx from 'classnames';

import { Wrapper } from "ui/control";
import "./Loading.css";

interface LoadingProps {
    className?: string | null;
    large?: boolean;
    overlay?: boolean;
}

export function Loading({className = null, large = false, overlay = false}: LoadingProps) {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
       const id = setTimeout(() => setVisible(true), 500);
       return () => clearTimeout(id);
    });

    if (!visible) {
        return null;
    }

    return (
        <Wrapper className={cx({"loading-overlay": overlay})}>
            <PulseLoader
                className={cx("loading", className)}
                color="#adb5bd"
                cssOverride={{display: "inline-block"}}
                size={large ? 25 : 10}
                loading
            />
        </Wrapper>
    );
}
