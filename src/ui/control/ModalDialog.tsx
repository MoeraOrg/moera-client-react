import React, { useCallback, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';

import { CloseButton } from "ui/control/CloseButton";
import "./ModalDialog.css";

interface Props {
    title?: string;
    size?: string;
    className?: string;
    style?: Partial<Record<string, string>>;
    centered?: boolean;
    risen?: boolean;
    onClose?: () => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    children: any;
}

export function ModalDialog({title, size, className, style, centered, risen, children, onClose, onKeyDown}: Props) {
    const mouseDownX = useRef<number>();
    const mouseDownY = useRef<number>();

    const onModalKeyDown = useCallback(event => {
        if (event.key === "Escape" && onClose) {
            onClose();
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    }, [onClose, onKeyDown]);

    const modalDialog = useRef<HTMLDivElement>(null);

    const onBackdropMouseDown = (e: React.MouseEvent) => {
        if (modalDialog.current != null) {
            const r = modalDialog.current.getBoundingClientRect();
            if (
                (r.left <= e.clientX && r.right >= e.clientX && r.top <= e.clientY && r.bottom >= e.clientY)
                || (e.clientX === 0 && e.clientY === 0) // Ugly hack, but need to workaround wrong mouse events in FF
            ) {
                mouseDownX.current = undefined;
                mouseDownY.current = undefined;
                return;
            }
        }
        mouseDownX.current = e.clientX;
        mouseDownY.current = e.clientY;
    }

    const onBackdropMouseUp = (e: React.MouseEvent) => {
        if (mouseDownX.current != null && Math.abs(mouseDownX.current - e.clientX) <= 10
            && mouseDownY.current != null && Math.abs(mouseDownY.current - e.clientY) <= 10
            && onClose != null) {

            onClose();
        }
        mouseDownX.current = undefined;
        mouseDownY.current = undefined;
    }

    useEffect(() => {
        document.body.addEventListener("keydown", onModalKeyDown);
        return () => {
            document.body.removeEventListener("keydown", onModalKeyDown);
        }
    }, [onModalKeyDown]);

    return ReactDOM.createPortal(
        <>
            <div className={cx("modal-backdrop", "show", {"risen": risen})}/>
            <div className={cx("modal", "show", {"risen": risen})}
                 onMouseDown={onBackdropMouseDown} onMouseUp={onBackdropMouseUp}>
                <div className={cx(
                    "modal-dialog",
                    className,
                    {
                        "modal-dialog-centered": centered,
                        [`modal-${size}`]: !!size
                    }
                )} style={style}>
                    <div className="modal-content" ref={modalDialog}>
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

ModalDialog.defaultProps = {
    centered: true
};
