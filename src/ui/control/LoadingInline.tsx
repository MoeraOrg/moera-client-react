import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import "./LoadingInline.css";

interface Props {
    className?: string | null;
}

export function LoadingInline({className = null}: Props) {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const id = setTimeout(() => setVisible(true), 500);
        return () => clearTimeout(id);
    });

    if (!visible) {
        return null;
    }

    return (
        <div className={cx("loading-inline", className)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 10">
                <circle transform="translate(8 0)" cx="0" r="0" cy="5">
                    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0"
                             keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
                             calcMode="spline"></animate>
                </circle>
                <circle transform="translate(16 0)" cx="0" r="0" cy="5">
                    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3"
                             keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
                             calcMode="spline"></animate>
                </circle>
                <circle transform="translate(24 0)" cx="0" r="0" cy="5">
                    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6"
                             keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
                             calcMode="spline"></animate>
                </circle>
            </svg>
        </div>
    );
}
