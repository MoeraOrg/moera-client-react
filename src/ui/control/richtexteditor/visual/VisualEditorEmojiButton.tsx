import React from 'react';
import { useTranslation } from 'react-i18next';
import EmojiPicker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import i18n from 'i18next';

import { msAddReaction } from "ui/material-symbols";
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import { useButtonPopper } from "ui/hook";

interface Props {
    onSelect?: (emoji: string) => void;
}

export default function VisualEditorEmojiButton({onSelect}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});

    const {t} = useTranslation();

    const onEmojiSelect = (data: any) => {
        onSelect && onSelect(data.native);
        hide();
    };

    return (
        <>
            <RichTextEditorButton ref={setButtonRef} icon={msAddReaction} title={t("emoji")} onClick={onToggle}/>
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
