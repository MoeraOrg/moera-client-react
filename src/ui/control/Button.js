import React from 'react';
import cx from 'classnames';

import { LoadingInline } from "ui/control";

export class Button extends React.PureComponent {

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
                <LoadingInline active={loading} />
                {props.children}{loading && "…"}
            </button>
        );
    }

}
