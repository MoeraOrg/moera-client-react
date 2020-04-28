import React from 'react';
import * as ReactDOM from 'react-dom';
import PropType from 'prop-types';
import cx from 'classnames';
import { Manager, Popper, Reference } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isFunction from 'lodash.isfunction';

export class Popover extends React.PureComponent {

    static propTypes = {
        text: PropType.string,
        textClassName: PropType.string,
        icon: PropType.string,
        title: PropType.string,
        element: PropType.elementType,
        onToggle: PropType.func
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

    show = () => {
        if (this.state.visible) {
            return;
        }
        this.setState({visible: true});
        document.addEventListener("click", this.documentClick);
        if (this.props.onToggle != null) {
            this.props.onToggle(true);
        }
    };

    hide = () => {
        if (!this.state.visible) {
            return;
        }
        this.setState({visible: false});
        document.removeEventListener("click", this.documentClick);
        if (this.props.onToggle != null) {
            this.props.onToggle(false);
        }
    };

    render() {
        const {text, textClassName, icon, title, element, children} = this.props;

        return (
            <Manager>
                <Reference>
                    {({ref}) => (
                        <span ref={ref} onClick={this.toggle} title={title} className={cx(
                            textClassName,
                            {"active": this.state.visible}
                        )}>
                            {element && React.createElement(element)}
                            {icon && <FontAwesomeIcon icon={icon}/>}
                            {text}
                        </span>
                    )}
                </Reference>
                {ReactDOM.createPortal(
                    <Popper placement="bottom" positionFixed={true}>
                        {({ref, style, placement, arrowProps, forceUpdate}) => (
                            <div ref={ref} style={style} className={cx(
                                "popover",
                                `bs-popover-${placement}`,
                                "fade",
                                {"show": this.state.visible}
                            )}>
                                <div ref={arrowProps.ref} style={arrowProps.style} className="arrow"/>
                                <div className="popover-body">
                                    {isFunction(children) ? children({hide: this.hide, update: forceUpdate}) : children}
                                </div>
                            </div>
                        )}
                    </Popper>,
                    document.querySelector("#modal-root")
                )}
            </Manager>
        );
    }

}
