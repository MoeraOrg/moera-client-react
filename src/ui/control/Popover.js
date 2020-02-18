import React from 'react';
import * as ReactDOM from 'react-dom';
import PropType from 'prop-types';
import cx from 'classnames';
import { Manager, Popper, Reference } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Popover extends React.PureComponent {

    static propTypes = {
        text: PropType.string,
        textClassName: PropType.string,
        icon: PropType.string,
        title: PropType.string
    };

    constructor(props, context) {
        super(props, context);

        this.state = {visible: false};
    }

    toggle = () => {
        if (!this.state.visible) {
            this.show();
        } else {
            this.hide();
        }
    };

    documentClick = event => {
        for (let element of document.querySelectorAll(".popover.show").values()) {
            const r = element.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY) {
                return;
            }
        }
        this.hide();
    };

    show() {
        this.setState({visible: true});
        document.addEventListener("click", this.documentClick);
    }

    hide() {
        this.setState({visible: false});
        document.removeEventListener("click", this.documentClick);
    }

    render() {
        const {text, textClassName, icon, title} = this.props;

        return (
            <Manager>
                <Reference>
                    {({ref}) => (
                        <span ref={ref} onClick={this.toggle} title={title} className={cx(
                            textClassName,
                            {"active": this.state.visible}
                        )}>
                            {icon && <FontAwesomeIcon icon={icon}/>}
                            {text}
                        </span>
                    )}
                </Reference>
                {ReactDOM.createPortal(
                    <Popper placement="bottom" positionFixed={true}>
                        {({ref, style, placement, arrowProps}) => (
                            <div ref={ref} style={style} className={cx(
                                "popover",
                                `bs-popover-${placement}`,
                                "fade",
                                {"show": this.state.visible}
                            )}>
                                <div ref={arrowProps.ref} style={arrowProps.style} className="arrow"/>
                                <div className="popover-body">{this.props.children}</div>
                            </div>
                        )}
                    </Popper>,
                    document.querySelector("#modal-root")
                )}
            </Manager>
        );
    }

}
