import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { EmojiListDialog } from "ui/control";
import Twemoji from "ui/twemoji/Twemoji";
import EmojiList from "util/emoji-list";
import "./EmojiListInput.css"

export class EmojiListInput extends React.PureComponent {

    static propTypes = {
        className: PropType.string,
        negative: PropType.bool,
        value: PropType.string,
        advanced: PropType.bool,
        onChange: PropType.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {editing: false};
    }

    edit = () => {
        this.setState({editing: true});
    };

    editingConfirmed = value => {
        this.setState({editing: false});
        this.props.onChange(value);
    };

    editingCancelled = () => {
        this.setState({editing: false});
    };

    render() {
        const {className, negative, value, advanced} = this.props;

        const list = new EmojiList(value);
        return (
            <div className={cx(className, "emoji-list-input")}>
                <div className="content" onClick={this.edit}>
                    {list.included().map(e => <Twemoji key={e} code={e}/>)}
                </div>
                <div className="button" onClick={this.edit}>
                    <FontAwesomeIcon icon="pen"/>
                </div>
                {this.state.editing &&
                    <EmojiListDialog negative={negative} value={value} advanced={advanced}
                                     onConfirm={this.editingConfirmed} onCancel={this.editingCancelled}/>}
            </div>
        );
    }

}
