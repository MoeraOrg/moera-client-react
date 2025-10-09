import React from 'react';

import { Button, Loading } from "ui/control";
import { Icon, msSync } from "ui/material-symbols";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onClick: () => void;
}

export default function ComplaintsSentinel({visible, loading, title, total, onClick}: Props) {
    if (loading) {
        return <div><Loading/></div>;
    }
    if (!visible) {
        return <div/>;
    }
    const fullTitle = total > 0 ? `${title} (${total})` : title;
    return (
        <Button variant="outline-primary" className="d-flex ms-auto me-auto mt-3" onClick={onClick}>
            <Icon className="icon" icon={msSync} size={20}/>&nbsp;{fullTitle}
        </Button>
    );
}
