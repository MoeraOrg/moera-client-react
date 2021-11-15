import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { Button } from "ui/control/Button";

interface Props {
    title: string;
    visible?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const PlusButton = ({title, visible = true, onClick}: Props) => (
    <Button variant="light" size="sm" className={cx("me-1", {"d-none": !visible})} onClick={onClick}>
        <FontAwesomeIcon icon="plus"/> {title}
    </Button>
);
