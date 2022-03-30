import React from 'react';
// @ts-ignore
import shortenUrl from 'shorten-url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useButtonPopper } from "ui/hook";
import { Button } from "ui/control";
import "./EntryLinkSelector.css";

interface Props {
    urls: string[];
    onSelect: (url: string) => void;
}

export default function EntryLinkSelector({urls, onSelect}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-start");

    if (urls.length === 0) {
        return null;
    }

    const onClick = (url: string) => (e: React.MouseEvent) => {
        hide();
        onSelect(url);
        e.preventDefault();
    }

    return (
        <div className="entry-link-selector">
            <div ref={setButtonRef} className="btn-group dropdown">
                <Button variant="outline-secondary" size="sm" className="dropdown-toggle" onClick={onToggle}>
                    Links{" "}
                    <span className="badge bg-info text-light">{urls.length}</span>
                </Button>
                {visible &&
                    <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                         className="fade popover shadow-sm show">
                        {urls.map(url =>
                            <div key={url} className="item" onClick={onClick(url)}>
                                <FontAwesomeIcon icon="link"/>
                                {" " + shortenUrl(url, 75)}
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}
