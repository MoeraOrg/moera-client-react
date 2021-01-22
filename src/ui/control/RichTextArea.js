import React from 'react';
import PropType from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

import { replaceSmileys } from "util/text";

export class RichTextArea extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        value: PropType.string,
        rows: PropType.number,
        placeholder: PropType.string,
        autoFocus: PropType.bool,
        className: PropType.string,
        autoComplete: PropType.string,
        disabled: PropType.bool,
        smileysEnabled: PropType.bool,
        onKeyDown: PropType.func,
        onChange: PropType.func,
        onBlur: PropType.func
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    #inputDom;
    #spaceInput = false;

    constructor(props, context) {
        super(props, context);

        this.#inputDom = React.createRef();
    }

    componentDidMount() {
        const {autoFocus} = this.props;

        if (this.#inputDom.current) {
            this.#inputDom.current.addEventListener("input", this.onInput);
            if (autoFocus) {
                this.#inputDom.current.focus();
            }
        }
    }

    componentWillUnmount() {
        if (this.#inputDom.current) {
            this.#inputDom.current.removeEventListener("input", this.onInput);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {disabled, autoFocus} = this.props;

        if (!disabled && prevProps.disabled && autoFocus && this.#inputDom.current) {
            this.#inputDom.current.focus();
        }
    }

    onChange = event => {
        const {smileysEnabled, onChange} = this.props;

        if (smileysEnabled && this.#spaceInput) {
            event.target.value = replaceSmileys(event.target.value, false);
        }
        if (onChange) {
            onChange(event);
        }
    }

    onInput = event => {
        this.#spaceInput = event.inputType === "insertLineBreak"
            || (event.inputType.startsWith("insert") && event.data != null && event.data.match(/\s/));
    }

    render() {
        const {name, value, className, autoComplete, placeholder, rows, disabled, onKeyDown, onBlur} = this.props;

        return (
            <TextareaAutosize
                name={name}
                value={value}
                id={name}
                className={className}
                autoComplete={autoComplete}
                placeholder={placeholder}
                rows={rows}
                maxRows={20}
                disabled={disabled}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onChange={this.onChange}
                ref={this.#inputDom} // impossible to pass lambda here
            />
        );
    }

}
