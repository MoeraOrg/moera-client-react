import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { Browser } from "api";
import { LoadingInline } from "ui/control";

export class Button extends React.PureComponent {

    static propTypes = {
        variant: PropType.string,
        size: PropType.oneOf(["sm", "lg"]),
        block: PropType.bool,
        invisible: PropType.bool,
        loading: PropType.bool,
        disabled: PropType.bool,
        className: PropType.string,
        type: PropType.string
    }

    componentDidMount() {
        if (this.props.autoFocus && this.domNode) {
            this.domNode.focus();
        }
    }

    render() {
        const {variant, size, block = false, invisible = false, loading = false, disabled = false, className = "",
               type = "button", ...props} = this.props;
        const klass = cx(
            "btn",
            `btn-${variant}`, {
                "btn-sm": size === "sm",
                "btn-lg": size === "lg",
                "btn-block": block,
                "invisible": invisible
            },
            className
        );
        return (
            <button type={type} className={klass} disabled={loading || disabled} {...props}
                    ref={dom => {this.domNode = dom}}>
                <LoadingInline active={loading}/>
                {!(loading && Browser.isTinyScreen()) &&
                    <>{props.children}{loading && "…"}</>
                }
            </button>
        );
    }

}
