import React from 'react';
import PropType from 'prop-types';
import * as textFieldEdit from 'text-field-edit';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import RichTextSpoilerDialog from "ui/control/richtexteditor/RichTextSpoilerDialog";
import { htmlEntities } from "util/html";
import "./RichTextEditorPanel.css";

export default class RichTextEditorPanel extends React.PureComponent {

    static propTypes = {
        textArea: PropType.object
    };

    state = {
        spoilerDialog: false
    };

    onBold = event => {
        const {textArea} = this.props;

        textFieldEdit.wrapSelection(textArea.current, "**");
        textArea.current.focus();
        event.preventDefault();
    }

    onItalic = event => {
        const {textArea} = this.props;

        textFieldEdit.wrapSelection(textArea.current, "_");
        textArea.current.focus();
        event.preventDefault();
    }

    onStrike = event => {
        const {textArea} = this.props;

        textFieldEdit.wrapSelection(textArea.current, "~~");
        textArea.current.focus();
        event.preventDefault();
    }

    onSpoiler = event => {
        this.setState({spoilerDialog: true});
        event.preventDefault();
    }

    onSpoilerSubmit = (ok, {title}) => {
        const {textArea} = this.props;

        this.setState({spoilerDialog: false});
        if (ok) {
            if (title) {
                textFieldEdit.wrapSelection(textArea.current,
                    `<mr-spoiler title="${htmlEntities(title)}">`, "</mr-spoiler>");
            } else {
                textFieldEdit.wrapSelection(textArea.current, "||");
            }
            textArea.current.focus();
        }
    }

    render() {
        const {spoilerDialog} = this.state;

        return (
            <div className="rich-text-editor-panel">
                <div className="group">
                    <RichTextEditorButton icon="bold" title="Bold" onClick={this.onBold}/>
                    <RichTextEditorButton icon="italic" title="Italic" onClick={this.onItalic}/>
                    <RichTextEditorButton icon="strikethrough" title="Strikeout" onClick={this.onStrike}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="exclamation-circle" title="Spoiler" onClick={this.onSpoiler}/>
                    <RichTextEditorButton icon="caret-square-down" title="Fold"/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="quote-left" title="Quote"/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="link" title="Link"/>
                    <RichTextEditorButton icon="image" title="Image"/>
                </div>
                <RichTextSpoilerDialog show={spoilerDialog} onSubmit={this.onSpoilerSubmit}/>
            </div>
        );
    }

}
