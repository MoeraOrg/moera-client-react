import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { Loading } from "ui/control";
import "./ComplaintsSentinel.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onClick: () => void;
}

export default function ComplaintsSentinel({visible, loading, title, total, onClick}: Props) {
    if (loading) {
        return (
            <div className="complaints-sentinel">
                <Loading/>
            </div>
        );
    }
    if (!visible) {
        return <div className="complaints-sentinel"/>;
    }
    const fullTitle = total > 0 ? `${title} (${total})` : title;
    return (
        <button className="btn btn-link complaints-sentinel" onClick={onClick}>
            <FontAwesomeIcon className="icon" icon={faSyncAlt}/>&nbsp;&nbsp;{fullTitle}
        </button>
    );
}
