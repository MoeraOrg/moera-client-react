import React, { useEffect, useMemo, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';

import { CloseButton, Loading } from "ui/control";
import { OverlayProps, useOverlay } from "ui/overlays/overlays";
import { randomId } from "util/ui";
import "./ModalDialog.css";

interface Props {
    title?: string;
    size?: string;
    className?: string;
    style?: Partial<Record<string, string>>;
    centered?: boolean;
    shadowClick?: boolean;
    loading?: boolean;
    onClose?: () => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    children: any;
}

export function ModalDialog({
    title, size, className, style, centered = true, shadowClick = true, loading, children, onClose, onKeyDown
}: Props) {
    const overlayProps = useMemo<Partial<OverlayProps>>(
        () => ({closeOnClick: shadowClick, onClose}),
        [onClose, shadowClick]
    );
    const overlayId = useRef<string>(randomId(4));
    const [modalDialog, zIndex] = useOverlay<HTMLDivElement>(overlayId.current, overlayProps);

    useEffect(() => {
        if (onKeyDown != null) {
            document.body.addEventListener("keydown", onKeyDown);
            return () => {
                document.body.removeEventListener("keydown", onKeyDown);
            }
        }
    }, [onKeyDown]);

    return ReactDOM.createPortal(
        <>
            <div className={cx("modal-backdrop", "show")} style={{zIndex: zIndex?.shadow}}/>
            <div className={cx("modal", "show")} style={{zIndex: zIndex?.widget}}>
                <div className={cx(
                    "modal-dialog",
                    className,
                    {
                        "modal-dialog-centered": centered,
                        [`modal-${size}`]: !!size
                    }
                )} style={style}>
                    <div className="modal-content" ref={modalDialog}>
                        {loading && <Loading overlay large/>}
                        {title &&
                            <div className="modal-header">
                                <h4 className="modal-title">{title}</h4>
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
        </>,
        document.getElementById("modal-root")!
    );
}
