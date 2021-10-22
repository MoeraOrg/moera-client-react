import React from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';
import { Manager, Popper, Reference } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { isFunction } from 'formik';

import "./Popover.css";
import { PositioningStrategy } from "@popperjs/core";

interface ChildrenProps {
    hide: () => void;
    update: () => void;
}

interface Props {
    className?: string;
    text?: string;
    textClassName?: string;
    icon?: IconProp;
    title?: string;
    element?: any;
    detached?: boolean;
    strategy?: PositioningStrategy;
    onToggle?: (visible: boolean) => void;
    children: ((props: ChildrenProps) => React.ReactNode) | React.ReactNode;
}

interface State {
    visible: boolean;
}

export class Popover extends React.PureComponent<Props, State> {

    static defaultProps = {
        strategy: "fixed"
    };

    constructor(props: Props, context: any) {
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

    documentClick = (event: MouseEvent) => {
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
        document.getElementById("app-root")!.addEventListener("click", this.documentClick);
        if (this.props.onToggle != null) {
            this.props.onToggle(true);
        }
    };

    hide = () => {
        if (!this.state.visible) {
            return;
        }
        this.setState({visible: false});
        document.getElementById("app-root")!.removeEventListener("click", this.documentClick);
        if (this.props.onToggle != null) {
            this.props.onToggle(false);
        }
    };

    render() {
        const {className, text, textClassName, icon, title, element, detached, strategy, children} = this.props;

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
                    (!detached || this.state.visible) &&
                        <Popper placement="bottom" strategy={strategy}>
                            {({ref, style, placement, arrowProps, forceUpdate}) => (
                                <div ref={ref} style={style} className={cx(
                                    "popover",
                                    "fade",
                                    `bs-popover-${placement}`, // activates Bootstrap style for .popover-arrow
                                    {"show": this.state.visible},
                                    className
                                )}>
                                    <div ref={arrowProps.ref} style={arrowProps.style} className="popover-arrow"/>
                                    <div className="popover-body">{
                                        isFunction(children) ?
                                            children({hide: this.hide, update: forceUpdate})
                                        :
                                            children
                                    }</div>
                                </div>
                            )}
                        </Popper>,
                    document.querySelector("#modal-root")!
                )}
            </Manager>
        );
    }

}
