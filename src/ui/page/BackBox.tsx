import React from 'react';
import { useSelector } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import { BackBoxContext } from "ui/page/backbox-context";
import "./BackBox.css";

interface Props {
    shadowMargin?: number;
    children?: React.ReactNode;
}

export default function BackBox({shadowMargin, children}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const {shadow, sentinel} = useScrollShadow({margin: shadowMargin ?? (connectedToHome ? 50 : 100)});

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
