import React from 'react';
import PropType from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

import { Browser } from "ui/browser";
import { replaceSmileys } from "util/text";

const MENTION_START = RegExp(/(^|\s)@$/);

export default class RichTextArea extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        value: PropType.string,
        rows: PropType.number,
        placeholder: PropType.string,
        className: PropType.string,
        autoFocus: PropType.bool,
        autoComplete: PropType.string,
        disabled: PropType.bool,
        smileysEnabled: PropType.bool,
        onKeyDown: PropType.func,
        onChange: PropType.func,
        onBlur: PropType.func,
        textArea: PropType.object,
        panel: PropType.object
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    #spaceInput = false;
    #anyInput = false;

    constructor(props, context) {
        super(props, context);

        this.state = {
            textArea: props.textArea ?? React.createRef()
        }
    }

    componentDidMount() {
        const {autoFocus} = this.props;
        const {textArea} = this.state;

        if (textArea.current) {
            textArea.current.addEventListener("input", this.onInput);
            if (autoFocus) {
                textArea.current.focus();
            }
        }
    }

    componentWillUnmount() {
        const {textArea} = this.state;

        if (textArea.current) {
            textArea.current.removeEventListener("input", this.onInput);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {disabled, autoFocus} = this.props;

        if (!disabled && prevProps.disabled && autoFocus && this.state.textArea.current) {
            this.state.textArea.current.focus();
        }
        if (this.props.textArea !== prevProps.textArea) {
            this.props.textArea.current = this.state.textArea.current;
            this.setState({textArea: this.props.textArea});
        }
    }

    onChange = event => {
        const {panel, smileysEnabled, onChange} = this.props;

        const value = event.target.value;
        const start = event.target.selectionStart;
        if (smileysEnabled && this.#spaceInput) {
            event.target.value = replaceSmileys(value, false);
        }
        if (this.#anyInput && value.length >= start && MENTION_START.test(value.substring(0, start))) {
            const button = panel.current.querySelector("button.mention");
            if (!button) {
                return false;
            }
            button.click();
        }
        if (onChange) {
            onChange(event);
        }
    }

    onInput = event => {
        this.#anyInput = event.inputType.startsWith("insert");
        this.#spaceInput = event.inputType === "insertLineBreak"
            || (this.#anyInput && event.data != null && event.data.match(/\s/));
    }

    onKeyDown = event => {
        const {onKeyDown} = this.props;

        if (this.onControlKey(event)) {
            event.preventDefault();
            return;
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    }

    onControlKey = event => {
        const {panel} = this.props;

        if (!panel.current || !event.ctrlKey || event.shiftKey || event.altKey || event.metaKey || !event.code
            || !event.code.startsWith("Key")) {
            return false;
        }
        const button = panel.current.querySelector(`button[data-letter=${event.code.substring(3)}]`);
        if (!button) {
            return false;
        }
        button.click();
        return true;
    }

    render() {
        const {name, value, className, autoComplete, placeholder, rows, disabled, onBlur} = this.props;
        const {textArea} = this.state;

        return (
            <TextareaAutosize
                name={name}
                value={value}
                id={name}
                className={className}
                autoComplete={autoComplete}
                placeholder={placeholder}
                rows={rows}
                maxRows={Browser.isTinyScreen() ? 15 : 20}
                disabled={disabled}
                onKeyDown={this.onKeyDown}
                onBlur={onBlur}
                onChange={this.onChange}
                ref={textArea} // impossible to pass lambda here
            />
        );
    }

}
