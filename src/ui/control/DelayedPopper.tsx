import React from 'react';
import { Manager as PopperManager, Popper, Reference as PopperReference } from 'react-popper';
import { Placement } from '@popperjs/core';
import cx from 'classnames';
import debounce from 'lodash.debounce';

interface ManagerProps {
    disabled?: boolean;
    clickable?: boolean;
    sticky?: boolean;
    onPreparePopper?: () => void;
    onShow?: () => boolean;
    children?: any;
}

type ClickLocus = "out" | "main" | "popup";

type TouchLocus = "none" | "touch" | "lock";

interface ManagerState {
    locus: ClickLocus;
    touch: TouchLocus;
    scrollY: number | null;
    popup: boolean;
    sticky: boolean;
    mainEnter: () => void;
    mainLeave: () => void;
    mainTouch: () => void;
    popupEnter: () => void;
    popupLeave: () => void;
    hide: () => void;
}

const DelayedPopperContext = React.createContext({} as ManagerState);

class Manager extends React.PureComponent<ManagerProps, ManagerState> {

    constructor(props: ManagerProps, context: any) {
        super(props, context);

        this.state = {
            locus: "out", // out, main, popup
            touch: "none", // none, touch, lock
            scrollY: null,
            popup: false,
            sticky: props.sticky ?? false,
            mainEnter: this.mainEnter,
            mainLeave: this.mainLeave,
            mainTouch: this.mainTouch,
            popupEnter: this.popupEnter,
            popupLeave: this.popupLeave,
            hide: this.hide
        };
    }

    isInPopover(event: MouseEvent) {
        return this.isInElements(event, ".popover-body") || this.isInElements(event, ".dropdown-menu");
    }

    isInElements(event: MouseEvent, selector: string) {
        for (let element of document.querySelectorAll(selector).values()) {
            const r = element.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY) {
                return true;
            }
        }
        return false;
    }

    documentClickCapture = (event: MouseEvent) => {
        if (!this.props.disabled) {
            switch (this.state.touch) {
                case "touch":
                    this.setLocus("out");
                    this.setTouch("none");
                    break;
                case "lock":
                    if (this.isInPopover(event)) {
                        break;
                    }
                    this.hide();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                default:
                    // do nothing
            }
        }
    };

    documentClick = (event: MouseEvent) => {
        if (!this.props.disabled && (!this.props.clickable || !this.isInPopover(event))) {
            this.hide();
        }
    };

    contextMenu = (event: MouseEvent) => {
        if (this.state.touch === "touch") {
            event.preventDefault();
        }
    }

    mainEnter = () => {
        this.setLocus("main");
    };

    mainLeave = () => {
        if (this.state.locus === "main") {
            this.setLocus("out");
        }
    };

    mainTouch = () => {
        if (this.state.locus === "out") {
            this.setLocus("main");
            this.setTouch("touch");
        }
    };

    popupEnter = () => {
        this.setLocus("popup");
    };

    popupLeave = () => {
        if (this.state.locus === "popup") {
            this.setLocus("out");
        }
    };

    setLocus(locus: ClickLocus) {
        if (this.props.disabled) {
            return;
        }

        const changed = this.state.locus !== locus;
        this.setState({locus});
        if (changed) {
            if (locus === "main" && this.props.onPreparePopper) {
                this.props.onPreparePopper();
            }
            this.onTimeout();
        }
    }

    setTouch(touch: TouchLocus) {
        if (this.props.disabled) {
            return;
        }

        this.setState({touch});
        if (touch !== "none") {
            this.setState({scrollY: window.scrollY});
            document.addEventListener("click", this.documentClickCapture, {capture: true, passive: false});
        } else {
            this.setState({scrollY: null});
            document.removeEventListener("click", this.documentClickCapture, {capture: true});
        }
        if (touch === "touch") {
            document.addEventListener("contextmenu", this.contextMenu);
        } else {
            document.removeEventListener("contextmenu", this.contextMenu);
        }
    }

    onTimeout = debounce(() => {
        const {locus, touch, scrollY} = this.state;

        if (touch !== "none" && scrollY != null && Math.abs(scrollY - window.scrollY) > 10) {
            this.setLocus("out");
            this.setTouch("none");
            return;
        }

        switch (locus) {
            case "out":
                this.hide();
                break;
            case "main":
                this.show();
                break;
            default:
                // do nothing
        }
    }, 1000);

    show() {
        if (this.props.onShow && !this.props.onShow()) {
            return;
        }

        this.setState({popup: true});
        if (this.state.touch === "touch") {
            this.setTouch("lock");
        }
        document.addEventListener("click", this.documentClick);
        document.addEventListener("hidepopper", this.hide);
    }

    hide = () => {
        this.setState({popup: false});
        if (this.state.touch !== "none") {
            this.setLocus("out");
            this.setTouch("none");
        }
        document.removeEventListener("click", this.documentClick);
        document.removeEventListener("hidepopper", this.hide);
    }

    render() {
        return (
            <PopperManager>
                <DelayedPopperContext.Provider value={this.state}>
                    {this.props.children}
                </DelayedPopperContext.Provider>
            </PopperManager>
        );
    }

}

export type DelayedPopperChildren = (ref: React.Ref<any>, mainEnter: () => void, mainLeave: (() => void) | undefined,
                                     mainTouch: () => void) => any;

interface ReferenceProps {
    children: DelayedPopperChildren;
}

const Reference = ({children}: ReferenceProps) => (
    <DelayedPopperContext.Consumer>
        {context => (
            <PopperReference>
                {({ref}) => children(ref, context.mainEnter, !context.sticky ? context.mainLeave : undefined,
                                     context.mainTouch)}
            </PopperReference>
        )}
    </DelayedPopperContext.Consumer>
);

interface DelayedPopperProps {
    placement: Placement;
    arrow?: boolean;
    className?: string;
    styles?: "popover" | "menu";
    children?: ((hide: () => void) => React.ReactNode) | React.ReactNode;
}

const DelayedPopper = ({placement, arrow, className, styles = "popover", children}: DelayedPopperProps) => (
    <DelayedPopperContext.Consumer>
        {context => (
            (context.popup || context.locus !== "out") &&
                <Popper placement={placement}>
                    {({ref, placement, style, arrowProps}) => (
                        <div ref={ref} style={style} className={cx(
                            "shadow",
                            "fade",
                            `bs-popover-${placement}`, // activates Bootstrap style for .popover-arrow
                            {
                                "popover": styles === "popover",
                                "dropdown-menu": styles === "menu",
                                "show": context.popup
                            },
                            className
                        )}>
                            {arrow && <div ref={arrowProps.ref} style={arrowProps.style} className="popover-arrow"/>}
                            <div className={cx({"popover-body": styles === "popover"})}
                                 onMouseEnter={context.popupEnter}
                                 onMouseLeave={!context.sticky ? context.popupLeave : undefined}>
                                {typeof(children) === "function" ? children(context.hide) : children}
                            </div>
                        </div>
                    )}
                </Popper>
        )}
    </DelayedPopperContext.Consumer>
);

export { Manager, Reference, DelayedPopper };
