import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import cx from 'classnames';

import "./Loading.css";

interface Props {
    className?: string | null;
    large?: boolean;
}

export function Loading({className = null, large = false}: Props) {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
       const id = setTimeout(() => setVisible(true), 500);
       return () => clearTimeout(id);
    });

    if (!visible) {
        return null;
    }

    return <ReactLoading className={cx("loading", className)} type="bubbles" color="black" width={large ? 80 : 32}
                         height={large ? 60 : 24}/>;
}
