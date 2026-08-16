import React, { useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { CheckboxField, InputField, NumberField, SelectField } from "ui/control/field";
import { isAndroidMedia, LocalMediaUploadSource } from "state/mediaupload/media-source";
import { RichTextImageStandardSize, STANDARD_SIZES } from "ui/control/richtexteditor/media/rich-text-image";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import UploadedImage from "ui/control/richtexteditor/media/UploadedImage";
import {
    richTextEditorDialog,
    RichTextEditorDialogBodyProps,
    RichTextEditorDialogProps
} from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { SelectedImages } from "ui/control/richtexteditor/dialog/SelectedImages";
import { MediaWithCaption } from "util/media-with-caption";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import { isVideoType } from "util/mime-type";
import "./RichTextImageDialog.css";

export interface RichTextImageValues {
    files?: LocalMediaUploadSource[] | null;
    mediaFiles?: MediaWithCaption[] | null;
    href?: string | null;
    compress?: boolean;
    standardSize?: RichTextImageStandardSize;
    customWidth?: number | null;
    customHeight?: number | null;
    caption?: string;
    play?: boolean;
}

type Props = {
    files?: LocalMediaUploadSource[] | null;
    mediaFiles?: MediaWithCaption[] | null;
    href?: string | null;
    insert?: boolean;
    nodeName?: RelNodeName | string;
    compressDefault?: boolean;
    mediaMaxSize?: number;
} & RichTextEditorDialogProps<RichTextImageValues>;

type BodyProps = RichTextEditorDialogBodyProps<Props>;

const mapPropsToValues = (props: Props): RichTextImageValues => ({
    files: props.files != null ? [...props.files] : null,
    mediaFiles: props.prevValues?.mediaFiles ?? props.mediaFiles,
    href: props.prevValues?.href ?? props.href,
    compress: props.compressDefault ?? true,
    standardSize: props.prevValues?.standardSize ?? "large",
    customWidth: props.prevValues?.customWidth,
    customHeight: props.prevValues?.customHeight,
    caption: props.prevValues?.caption ?? "",
    play: props.prevValues?.play ?? false,
});

function RichTextImageDialog({
    mediaFiles, insert, nodeName = REL_CURRENT, mediaMaxSize, onSubmit, okButtonRef
}: BodyProps) {
    const [, {value: files}, {setValue: setFiles}] = useField<LocalMediaUploadSource[] | null>("files");
    const [, {value: standardSize}] = useField<RichTextImageStandardSize>("standardSize");
    const {t} = useTranslation();

    const {discardOpenFiles} = useRichTextEditorMedia();

    useEffect(() => {
        // If there is no other field that should receive focus
        if (
            !(files == null && mediaFiles == null)
            && !(!insert && files?.length === 1)
            && okButtonRef?.current != null
        ) {
            okButtonRef.current.focus();
        }
    }, [files, insert, mediaFiles, okButtonRef]);

    useEffect(() => {
        if (okButtonRef.current != null) {
            const valid = mediaMaxSize == null || files == null || files.every(file => file.size <= mediaMaxSize);
            okButtonRef.current.disabled = !valid;
        }
    }, [files, mediaMaxSize, okButtonRef]);

    const onDelete = (index: number, e: React.MouseEvent) => {
        if (files != null) {
            const file = files[index];
            if (isAndroidMedia(file)) {
                discardOpenFiles(file.id);
            }
            if (files.length === 1 && index === 0) {
                onSubmit(false, {});
            } else {
                void setFiles(files.toSpliced(index, 1));
            }
        }
        e.preventDefault();
    }

    const hasVideo = useMemo(() =>
        files?.some(file => isVideoType(file.type)) || mediaFiles?.some(mediaFile => isVideoType(mediaFile.mimeType)),
        [files, mediaFiles]
    );

    return (
        <>
            {files != null &&
                <SelectedImages files={files} maxSize={mediaMaxSize} onDelete={onDelete}/>
            }
            {mediaFiles != null &&
                <div className="rich-text-editor-image-list pt-0 mb-3">
                    {mediaFiles.map(mediaFile =>
                        <UploadedImage
                            key={mediaFile.mediaId}
                            media={mediaFile}
                            nodeName={nodeName}
                            showMenu={false}
                        />
                    )}
                </div>
            }
            {files == null && mediaFiles == null &&
                <InputField type="url" name="href" title={t("link")} anyValue autoFocus/>
            }
            {files != null &&
                <CheckboxField title={t("compress-images-video")} name="compress" groupClassName="mt-3 mb-0" anyValue/>
            }
            {insert &&
                <>
                    <SelectField name="standardSize" title={t("size")} choices={STANDARD_SIZES} horizontal anyValue/>
                    {standardSize === "custom" &&
                        <div className="rich-text-image-dialog-size">
                            <NumberField name="customWidth" title={t("width")} horizontal min={0}
                                         format={{useGrouping: false}}/>
                            <NumberField name="customHeight" title={t("height")} horizontal min={0}
                                         format={{useGrouping: false}}/>
                        </div>
                    }
                    {hasVideo &&
                        <CheckboxField title={t("play-video-inline")} name="play" groupClassName="ps-2" anyValue/>
                    }
                    {((files == null && mediaFiles == null) || files?.length === 1 || mediaFiles?.length === 1) &&
                        <InputField
                            name="caption"
                            title={!hasVideo ? t("caption-image-optional") : t("caption-video-optional")}
                            anyValue
                        />
                    }
                </>
            }
        </>
    );
}

function getTitle({mediaFiles, insert}: Props): string {
    const hasVideo = mediaFiles?.some(mediaFile => isVideoType(mediaFile.mimeType));
    if (insert) {
        return mediaFiles != null
            ? (!hasVideo ? "edit-inserted-image" : "edit-inserted-video")
            : "insert-images-or-video";
    } else {
        return "add-images-or-video";
    }
}

export default richTextEditorDialog<Props, RichTextImageValues>(getTitle, mapPropsToValues, RichTextImageDialog);
