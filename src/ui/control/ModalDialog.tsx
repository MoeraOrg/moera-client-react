import React, { useCallback, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';

import "./ModalDialog.css";

interface Props {
    title?: string;
    size?: string;
    className?: string;
    style?: Record<string, string>;
    centered?: boolean;
    risen?: boolean;
    onClose?: () => void;
    children: any;
}

export function ModalDialog({title, size, className, style, centered, risen, children, onClose}: Props) {
    const onModalKeyDown = useCallback(event => {
        if (event.key === "Escape" && onClose) {
            onClose();
        }
    }, [onClose]);

    const onModalDialogClick = (e: React.MouseEvent) => e.stopPropagation();

    useEffect(() => {
        document.body.addEventListener("keydown", onModalKeyDown);
        return () => {
            document.body.removeEventListener("keydown", onModalKeyDown);
        }
    }, [onModalKeyDown]);

    return ReactDOM.createPortal(
        <>
            <div className={cx("modal-backdrop", "show", {"risen": risen})}/>
            <div className={cx("modal", "show", {"risen": risen})} onClick={onClose}>
                <div className={cx(
                    "modal-dialog",
                    className,
                    {
                        "modal-dialog-centered": centered,
                        [`modal-${size}`]: !!size
                    }
                )} style={style} onClick={onModalDialogClick}>
                    <div className="modal-content">
                        {title &&
                            <div className="modal-header">
                                <h4 className="modal-title">{title}</h4>
                                {onClose &&
                                    <button type="button" className="close" onClick={onClose}>&times;</button>
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
