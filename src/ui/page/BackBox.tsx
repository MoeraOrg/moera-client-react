import React from 'react';

import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import { BackBoxContext } from "ui/page/backbox-context";
import "./BackBox.css";

interface Props {
    children?: React.ReactNode;
}

export default function BackBox({children}: Props) {
    const {shadow, sentinel} = useScrollShadow();

    return (
        <>
            <div id="back-box-sentinel" aria-hidden="true" ref={sentinel}/>
            <div id="back-box">
                <BackBoxContext.Provider value={{shadow}}>
                    {children}
                </BackBoxContext.Provider>
            </div>
        </>
    );
}
