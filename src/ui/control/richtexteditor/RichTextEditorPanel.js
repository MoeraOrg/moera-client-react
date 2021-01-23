import React from 'react';
import PropType from 'prop-types';
import * as textFieldEdit from 'text-field-edit';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import "./RichTextEditorPanel.css";

export default class RichTextEditorPanel extends React.PureComponent {

    static propTypes = {
        textArea: PropType.object
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

    render() {
        return (
            <div className="rich-text-editor-panel">
                <div className="group">
                    <RichTextEditorButton icon="bold" title="Bold" onClick={this.onBold}/>
                    <RichTextEditorButton icon="italic" title="Italic" onClick={this.onItalic}/>
                    <RichTextEditorButton icon="strikethrough" title="Strikeout" onClick={this.onStrike}/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="exclamation-circle" title="Spoiler"/>
                    <RichTextEditorButton icon="caret-square-down" title="Fold"/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="quote-left" title="Quote"/>
                </div>
                <div className="group">
                    <RichTextEditorButton icon="link" title="Link"/>
                    <RichTextEditorButton icon="image" title="Image"/>
                </div>
            </div>
        );
    }

}
