import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { msAttachFile, msImage } from "ui/material-symbols";
import { Tabs } from "ui/control";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { AttachmentType, useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { mediaHashesExtract } from "util/media-images";
import { notNull } from "util/misc";
import "./RichTextEditorDropzoneTabs.css";

interface Props {
    value: RichTextValue;
}

export default function RichTextEditorDropzoneTabs({value}: Props) {
    const {attachmentType, setAttachmentType} = useRichTextEditorMedia();
    const {t} = useTranslation();

    const [totalImages, totalFiles] = useMemo(() => {
        const embedded = mediaHashesExtract(value.value);
        const mediaList = value.media?.filter(notNull);
        return [
            mediaList?.filter(media => !media.attachment).filter(media => !embedded.has(media.hash)).length,
            mediaList?.filter(media => media.attachment).length
        ];
    }, [value]);

    return (
        <Tabs<AttachmentType>
            tabs={[
                {
                    icon: msImage,
                    title: t("images"),
                    value: "image",
                    count: totalImages !== 0 ? totalImages : undefined,
                },
                {
                    icon: msAttachFile,
                    title: t("files"),
                    value: "file",
                    count: totalFiles !== 0 ? totalFiles : undefined,
                }
            ]}
            value={attachmentType}
            onChange={setAttachmentType}
            className="rich-text-editor-dropzone-tabs"
            scroll="never"
        />
    );
}
