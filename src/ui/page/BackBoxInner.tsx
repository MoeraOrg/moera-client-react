import React from 'react';
import cx from 'classnames';

import { useBackBox } from "ui/page/backbox-context";
import "./BackBoxInner.css";

interface Props {
    className?: string;
    noShadow?: boolean;
    children?: React.ReactNode;
}

export default function BackBoxInner({className, noShadow, children}: Props) {
    const {shadow} = useBackBox();

    return (
        <div className={cx("back-box-inner", {"back-box-shadow": !noShadow && shadow}, className)}>
            {children}
        </div>
    );
}
