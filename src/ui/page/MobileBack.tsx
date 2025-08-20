import React from 'react';
import cx from 'classnames';

import { Button } from "ui/control";
import { Icon, msArrowBack } from "ui/material-symbols";
import "./MobileBack.css";

interface Props {
    className?: string;
    onBack: () => void;
    children?: React.ReactNode;
}

export default function MobileBack({className, onBack, children}: Props) {
    return (
        <div className={cx("mobile-back", className)}>
            <Button variant="silent-round" onClick={() => onBack()}><Icon icon={msArrowBack} size={24}/></Button>
            {children}
        </div>
    );
}
