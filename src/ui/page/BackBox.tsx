import React, { useCallback, useState } from 'react';

import { useIntersect } from "ui/hook";
import { BackBoxContext } from "ui/page/backbox-context";
import "./BackBox.css";

interface Props {
    children?: React.ReactNode;
}

export default function BackBox({children}: Props) {
    const [shadow, setShadow] = useState<boolean>(false);

    const onIntersect = useCallback(
        (intersecting: boolean) => setShadow(!intersecting),
        [setShadow]
    );

    const sentinel = useIntersect(onIntersect);

    return (
        <>
            <div className="back-box-sentinel" aria-hidden="true" ref={sentinel}/>
            <div className="back-box">
                <BackBoxContext.Provider value={{shadow}}>
                    {children}
                </BackBoxContext.Provider>
            </div>
        </>
    );
}
