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

export default function CommentsSentinel({visible, loading, title, total, onClick}: Props) {
    if (!visible) {
        return null;
    }
    if (loading) {
        return <div><Loading/></div>;
    }
    const fullTitle = total > 0 ? `${title} (${total})` : title;
    return (
        <Button variant="outline-primary" className="d-flex" onClick={onClick}>
            <Icon icon={msSync} size={20}/>&nbsp;{fullTitle}
        </Button>
    );
}
