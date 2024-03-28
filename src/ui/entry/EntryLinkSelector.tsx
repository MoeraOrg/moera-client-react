import React from 'react';
// @ts-ignore
import shortenUrl from 'shorten-url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import { Button } from "ui/control";
import "./EntryLinkSelector.css";

interface Props {
    urls: string[];
    onSelect: (url: string) => void;
    disabled?: boolean;
}

export default function EntryLinkSelector({urls, onSelect, disabled}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex
    } = useButtonPopper("bottom-start");
    const {t} = useTranslation();

    if (urls.length === 0) {
        return null;
    }

    const onClick = (url: string) => (e: React.MouseEvent) => {
        hide();
        onSelect(url);
        e.preventDefault();
    }

    const uniqueUrls = [...new Set(urls)];

    return (
        <div className="entry-link-selector">
            <div ref={setButtonRef} className="btn-group">
                <Button variant="outline-secondary" size="sm" className="dropdown-toggle" disabled={disabled}
                        onClick={onToggle}>
                    {t("links") + " "}
                    <span className="badge bg-info text-light">{uniqueUrls.length}</span>
                </Button>
                {visible &&
                    <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                         className="fade dropdown-menu popover shadow-sm show">
                        {uniqueUrls.map(url =>
                            <div key={url} className="item" onClick={onClick(url)}>
                                <FontAwesomeIcon icon={faLink}/>
                                {" " + shortenUrl(url, 75)}
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}
