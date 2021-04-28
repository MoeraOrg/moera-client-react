import React from 'react';
import PropType from 'prop-types';
import { Manager as PopperManager, Popper, Reference as PopperReference } from 'react-popper';
import cx from 'classnames';
import debounce from 'lodash.debounce';

const DelayedPopperContext = React.createContext({});

class Manager extends React.PureComponent {

    static propTypes = {
        disabled: PropType.bool,
        clickable: PropType.bool,
        onPreparePopper: PropType.func,
        onShow: PropType.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            locus: "out", // out, main, popup
            touch: "none", // none, touch, lock
            scrollY: null,
            popup: false,
            reactions: [],
            mainEnter: this.mainEnter,
            mainLeave: this.mainLeave,
            mainTouch: this.mainTouch,
            popupEnter: this.popupEnter,
            popupLeave: this.popupLeave
        };
    }

    isInPopover(event) {
        for (let element of document.querySelectorAll(".popover-body").values()) {
            const r = element.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY) {
                return true;
            }
        }
        return false;
    }

    documentClickCapture = event => {
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

    documentClick = event => {
        if (!this.props.disabled && (!this.props.clickable || !this.isInPopover(event))) {
            this.hide();
        }
    };

    contextMenu = event => {
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

    setLocus(locus) {
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

    setTouch(touch) {
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
    }

    hide() {
        this.setState({popup: false});
        if (this.state.touch !== "none") {
            this.setLocus("out");
            this.setTouch("none");
        }
        document.removeEventListener("click", this.documentClick);
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

const Reference = ({children}) => (
    <DelayedPopperContext.Consumer>
        {context => (
            <PopperReference>
                {({ref}) => children(ref, context.mainEnter, context.mainLeave, context.mainTouch)}
            </PopperReference>
        )}
    </DelayedPopperContext.Consumer>
);

const DelayedPopper = ({placement, arrow, className, children}) => (
    <DelayedPopperContext.Consumer>
        {context => (
            (context.popup || context.locus !== "out") &&
                <Popper placement={placement}>
                    {({ref, style, arrowProps}) => (
                        <div ref={ref} style={style} className={cx(
                            "popover",
                            "shadow",
                            "fade",
                            {"show": context.popup},
                            className
                        )}>
                            {arrow && <div ref={arrowProps.ref} style={arrowProps.style} className="arrow"/>}
                            <div className="popover-body" onMouseEnter={context.popupEnter}
                                 onMouseLeave={context.popupLeave}>
                                {children}
                            </div>
                        </div>
                    )}
                </Popper>
        )}
    </DelayedPopperContext.Consumer>
);

export { Manager, Reference, DelayedPopper };
