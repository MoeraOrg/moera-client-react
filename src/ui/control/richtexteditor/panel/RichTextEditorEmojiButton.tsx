import React from 'react';
import { useTranslation } from 'react-i18next';
import EmojiPicker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import i18n from 'i18next';

import { useButtonPopper } from "ui/hook";
import { msSentimentSatisfied } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";

interface Props {
    iconSize?: number;
    onSelect?: (emoji: string) => void;
}

export default function RichTextEditorEmojiButton({iconSize, onSelect}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});
    const {focus} = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        focus();
        onToggle(event);
    }

    const onEmojiSelect = (data: any) => {
        onSelect && onSelect(data.native);
        hide();
    };

    return (
        <>
            <RichTextEditorButton ref={setButtonRef} icon={msSentimentSatisfied} iconSize={iconSize} title={t("emoji")}
                                  onClick={onClick}/>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className={`fade popover bs-popover-${placement} shadow-sm show`}>
                    <EmojiPicker data={emojiData} locale={i18n.language} previewPosition="none"
                                 onEmojiSelect={onEmojiSelect}/>
                    <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                </div>
            }
        </>
    );
}
