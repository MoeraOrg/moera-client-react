import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import emojiData from '@emoji-mart/data';
import { Picker } from 'emoji-mart';

import { useButtonPopper } from "ui/hook";
import { msSentimentSatisfied } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";

interface Props {
    iconSize?: number;
    onSelect?: (emoji: string) => void;
}

interface EmojiSelection {
    native: string;
}

export default function RichTextEditorEmojiButton({iconSize, onSelect}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, placement, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});
    const {focus} = useRichTextEditorCommands();
    const {t, i18n} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        focus();
        onToggle(event);
    }

    const onEmojiSelect = useCallback((selection: EmojiSelection) => {
        onSelect && onSelect(selection.native);
        hide();
    }, [hide, onSelect]);

    const setEmojiPickerParent = useCallback((parent: HTMLDivElement | null) => {
        setPopperRef(parent);
        if (parent != null && !parent.hasChildNodes()) {
            new Picker({
                data: emojiData,
                locale: i18n.language,
                previewPosition: "none",
                onEmojiSelect,
                parent
            });
        }
    }, [i18n.language, onEmojiSelect, setPopperRef]);

    return (
        <>
            <RichTextEditorButton ref={setButtonRef} icon={msSentimentSatisfied} iconSize={iconSize} title={t("emoji")}
                                  onClick={onClick}/>
            {visible &&
                <div ref={setEmojiPickerParent} style={{...popperStyles, zIndex: zIndex?.widget}}
                     className={`fade popover bs-popover-${placement} shadow-sm show`}/>
            }
        </>
    );
}
