import React from 'react';
import PropType from 'prop-types';
import { Manager as PopperManager, Popper, Reference as PopperReference } from 'react-popper';
import cx from 'classnames';
import debounce from 'lodash.debounce';

const DelayedPopperContext = React.createContext({});

class Manager extends React.PureComponent {

    static propTypes = {
        disabled: PropType.bool,
        onPreparePopper: PropType.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            locus: "out",
            popup: false,
            reactions: [],
            mainEnter: this.mainEnter,
            mainLeave: this.mainLeave,
            popupEnter: this.popupEnter,
            popupLeave: this.popupLeave
        };
    }

    documentClick = () => {
        if (!this.props.disabled) {
            this.hide();
        }
    };

    mainEnter = () => {
        this.setLocus("main");
    };

    mainLeave = () => {
        if (this.state.locus === "main") {
            this.setLocus("out");
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

    onTimeout = debounce(() => {
        switch (this.state.locus) {
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
        this.setState({popup: true});
        document.addEventListener("click", this.documentClick);
    }

    hide() {
        this.setState({popup: false});
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
                {({ref}) => children(ref, context.mainEnter, context.mainLeave)}
            </PopperReference>
        )}
    </DelayedPopperContext.Consumer>
);

const DelayedPopper = ({placement, arrow, className, children}) => (
    <DelayedPopperContext.Consumer>
        {context => (
            (context.popup || context.locus !== "out") &&
                <Popper placement={placement}>
                    {({ref, style, placement, arrowProps}) => (
                        <div ref={ref} style={style} className={cx(
                            "popover",
                            `bs-popover-${placement}`,
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
