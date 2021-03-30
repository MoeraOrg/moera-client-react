import React from 'react';
import PropType from 'prop-types';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';

import "./ModalDialog.css";

export class ModalDialog extends React.PureComponent {

    static propTypes = {
        title: PropType.string,
        size: PropType.string,
        className: PropType.string,
        style: PropType.object,
        centered: PropType.bool,
        onClose: PropType.func
    };

    static defaultProps = {
        centered: true
    };

    componentDidMount() {
        document.body.addEventListener("keydown", this.onModalKeyDown);
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.onModalKeyDown);
    }

    onModalKeyDown = e => {
        const {onClose} = this.props;

        if (e.key === "Escape" && onClose) {
            onClose();
        }
    }

    onModalDialogClick = e => e.stopPropagation();

    render() {
        const {title, size, className, style, centered, children, onClose} = this.props;

        return ReactDOM.createPortal(
            <>
                <div className="modal-backdrop show"/>
                <div className="modal show" onClick={onClose}>
                    <div className={cx(
                        "modal-dialog",
                        className,
                        {
                            "modal-dialog-centered": centered,
                            [`modal-${size}`]: !!size
                        }
                    )} style={style} onClick={this.onModalDialogClick}>
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
            document.getElementById("modal-root")
        );
    }

}

