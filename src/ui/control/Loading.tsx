import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
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
            <ReactLoading className={cx("loading", className)} type="bubbles" color="black" width={large ? 80 : 32}
                          height={large ? 60 : 24}/>
        </Wrapper>
    );
}
