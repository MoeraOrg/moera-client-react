import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { Loading } from "ui/control";
import "./ComplainsSentinel.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onClick: () => void;
}

export default function ComplainsSentinel({visible, loading, title, total, onClick}: Props) {
    if (loading) {
        return (
            <div className="complains-sentinel">
                <Loading/>
            </div>
        );
    }
    if (!visible) {
        return <div className="complains-sentinel"/>;
    }
    const fullTitle = total > 0 ? `${title} (${total})` : title;
    return (
        <button className="btn btn-link complains-sentinel" onClick={onClick}>
            <FontAwesomeIcon className="icon" icon={faSyncAlt}/>&nbsp;&nbsp;{fullTitle}
        </button>
    );
}
