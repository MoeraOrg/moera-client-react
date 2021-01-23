import React from 'react';
import PropType from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

import { replaceSmileys } from "util/text";

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
        textArea: PropType.object
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    #spaceInput = false;

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
                maxRows={20}
                disabled={disabled}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onChange={this.onChange}
                ref={textArea} // impossible to pass lambda here
            />
        );
    }

}
