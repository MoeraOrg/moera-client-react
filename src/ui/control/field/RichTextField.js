import React from 'react';
import PropType from 'prop-types';

import { TextField } from "ui/control/field/TextField";
import { replaceSmileys } from "util/text";

export class RichTextField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        rows: PropType.number,
        placeholder: PropType.string,
        autoFocus: PropType.bool,
        disabled: PropType.bool,
        smileysEnabled: PropType.bool,
        onKeyDown: PropType.func
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    #spaceInput = false;

    onChange = event => {
        const {smileysEnabled} = this.props;

        if (smileysEnabled && this.#spaceInput) {
            event.target.value = replaceSmileys(event.target.value, false);
        }
    }

    onInput = event => {
        this.#spaceInput = event.inputType === "insertLineBreak"
            || (event.inputType.startsWith("insert") && event.data != null && event.data.match(/\s/));
    }

    render() {
        const {name, disabled, autoFocus, onKeyDown} = this.props;

        return (
            <TextField name={name} anyValue autoFocus={autoFocus} disabled={disabled} onChange={this.onChange}
                       onInput={this.onInput} onKeyDown={onKeyDown}/>
        );
    }

}
