import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Loading } from "ui/control";
import "./CommentsSentinel.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onClick: () => void;
}

export default function CommentsSentinel({visible, loading, title, total, onClick}: Props) {
    if (!visible) {
        return <div className="comments-sentinel"/>;
    }
    if (loading) {
        return (
            <div className="comments-sentinel">
                <Loading/>
            </div>
        );
    }
    const fullTitle = total > 0 ? `${title} (${total})` : title;
    return (
        <button className="btn btn-link comments-sentinel" onClick={onClick}>
            <FontAwesomeIcon className="icon" icon="sync-alt"/>&nbsp;&nbsp;{fullTitle}
        </button>
    );
}
