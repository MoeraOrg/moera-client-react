import React, { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { tTitle } from "i18n";
import { getFeedWidth } from "state/settings/selectors";
import { CloseButton, Loading, ModalDialogContext } from "ui/control";
import { useOverlay } from "ui/overlays/overlays";
import "./ModalDialog.css";

interface Props {
    title?: string;
    size?: string;
    className?: string;
    centered?: boolean;
    shadowClick?: boolean;
    loading?: boolean;
    parentOverlayId?: string;
    onClose?: () => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    children: any;
}

export function ModalDialog({
    title, size, className, centered = true, shadowClick = true, loading, parentOverlayId, onClose, onKeyDown, children
}: Props) {
    const feedWidth = useSelector(getFeedWidth);
    const modalDialog = useRef<HTMLDivElement>(null);
    const [zIndex, overlayId]
        = useOverlay(modalDialog, {parentId: parentOverlayId, closeOnClick: shadowClick, onClose});

    useEffect(() => {
        if (onKeyDown != null) {
            document.body.addEventListener("keydown", onKeyDown);
            return () => {
                document.body.removeEventListener("keydown", onKeyDown);
            }
        }
    }, [onKeyDown]);

    return ReactDOM.createPortal(
        <ModalDialogContext.Provider value={{overlayId}}>
            <div className={cx("modal-backdrop", "show")} style={{zIndex: zIndex?.shadow}}/>
            <div className={cx("modal", "show")} style={{zIndex: zIndex?.widget}}>
                <div className={cx(
                    "modal-dialog",
                    className,
                    {
                        "modal-dialog-centered": centered,
                        [`modal-${size}`]: !!size
                    }
                // @ts-ignore
                )} style={{"--feed-width": feedWidth + "px"}}>
                    <div className="modal-content" ref={modalDialog}>
                        {loading && <Loading overlay large/>}
                        {title &&
                            <div className="modal-header">
                                <h4 className="modal-title">{tTitle(title)}</h4>
                                {onClose &&
                                    <CloseButton onClick={onClose}/>
                                }
                            </div>
                        }
                        <div className="modal-children">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ModalDialogContext.Provider>,
        document.getElementById("modal-root")!
    );
}
