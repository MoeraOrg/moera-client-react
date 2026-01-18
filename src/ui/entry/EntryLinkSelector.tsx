import React from 'react';
// @ts-ignore
import shortenUrl from 'shorten-url';
import { useTranslation } from 'react-i18next';

import { Icon, msLink } from "ui/material-symbols";
import { useButtonPopper, useParent } from "ui/hook";
import { Button } from "ui/control";
import "./EntryLinkSelector.css";

interface Props {
    urls: string[];
    onSelect: (url: string) => void;
    disabled?: boolean;
}

export default function EntryLinkSelector({urls, onSelect, disabled}: Props) {
    const {overlayId: parentOverlayId} = useParent();
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, zIndex
    } = useButtonPopper("bottom-start", {parentOverlayId});
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
                <Button variant="tool" size="sm" className="dropdown-toggle" active={visible} disabled={disabled}
                        onClick={onToggle}>
                    {t("links")} ({uniqueUrls.length})
                </Button>
                {visible &&
                    <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}}
                         className="fade dropdown-menu popover shadow-sm show">
                        {uniqueUrls.map(url =>
                            <div key={url} className="item" onClick={onClick(url)}>
                                <Icon icon={msLink} size={15}/>
                                {" " + shortenUrl(url, 75)}
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}
