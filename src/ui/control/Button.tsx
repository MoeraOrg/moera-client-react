import React from 'react';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { LoadingInline } from "ui/control/index";

type Props = {
    variant: string;
    size?: "sm" | "lg";
    block?: boolean;
    invisible?: boolean;
    loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export class Button extends React.PureComponent<Props> {

    domNode: HTMLButtonElement | null = null;

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
                "flex-fill": block,
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
