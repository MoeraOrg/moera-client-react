import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { MediaCaption } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { closeImageEditDialog } from "state/imageeditdialog/actions";
import { useDispatcher } from "ui/hook";
import { Button, ModalDialog } from "ui/control";
import { RichTextField, RichTextValue } from "ui/control/richtexteditor";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { useMediaAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import { MediaWithCaption } from "util/media-with-caption";
import "./ImageEditDialog.css";

interface OuterProps {
    homeOwnerName: string | null;
    homeOwnerFullName: string | null;
    media: MediaWithCaption | null;
    posting: ExtPostingInfo | null;
    smileysEnabled: boolean;
    setMediaCaption: (mediaId: string, caption?: MediaCaption | null) => void;
}

interface Values {
    caption: RichTextValue;
}

type Props = OuterProps & FormikProps<Values>;

function ImageEditDialogInner(props: Props) {
    const {posting, smileysEnabled, submitForm, resetForm} = props;

    const parentOverlayId = useSelector((state: ClientState) => state.imageEditDialog.parentOverlayId);
    const media = useSelector((state: ClientState) => state.imageEditDialog.media);
    const nodeName = useSelector((state: ClientState) => state.imageEditDialog.nodeName);
    const loading = useSelector((state: ClientState) => state.imageEditDialog.loading);
    const saving = useSelector((state: ClientState) => state.imageEditDialog.saving);
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    useEffect(() => {
        const values = logic.mapPropsToValues(props);
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posting, resetForm]); // 'props' are missing on purpose

    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = useMediaAttributes(nodeName, media?.media ?? null, media?.remoteMedia ?? null, 800);

    if (media == null) {
        return null;
    }

    const onClose = () => dispatch(closeImageEditDialog());

    return (
        <ModalDialog title={t("edit-image")} parentOverlayId={parentOverlayId} loading={loading} onClose={onClose}>
            <Form>
                <div className="modal-body image-edit-dialog">
                    {src != null ?
                        <img className="preview" alt={alt ?? ""} src={src} srcSet={srcSet} sizes={sizes}
                             width={imageWidth} height={imageHeight}/>
                    :
                        <ImagePlaceholder width={imageWidth} height={imageHeight}/>
                    }
                    <RichTextField
                        name="caption"
                        placeholder={t("description-optional")}
                        format={posting?.bodySrcFormat || "markdown"}
                        maxHeight="14em"
                        smileysEnabled={smileysEnabled}
                        noComplexBlocks
                        noEmbeddedMedia
                        noMedia
                        noVideo
                        anyValue
                        autoFocus
                        submitKey="enter"
                        onSubmit={submitForm}
                    />
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={saving}>{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const logic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        caption: new RichTextValue(
            props.media?.caption?.captionSrc?.text ?? props.posting?.bodySrc?.text ?? "",
            (props.media?.caption?.captionSrcFormat ?? props.posting?.bodySrcFormat) || "markdown"
        )
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        if (formik.props.media?.mediaId != null) {
            formik.props.setMediaCaption(
                formik.props.media?.mediaId,
                {
                    mediaId: formik.props.media.mediaId,
                    captionSrc: {
                        text: values.caption.toText(formik.props.smileysEnabled)
                    },
                    captionSrcFormat: formik.props.posting?.bodySrcFormat || "markdown",
                }
            );
        }
        dispatch(closeImageEditDialog());
        formik.setSubmitting(false);
    }

};

const ImageEditDialogOuter = withFormik(logic)(ImageEditDialogInner);

export default function ImageEditDialog() {
    const {setMediaCaption} = useRichTextEditorMedia();
    const homeOwnerName = useSelector(getHomeOwnerName);
    const homeOwnerFullName = useSelector(getHomeOwnerFullName);
    const media = useSelector((state: ClientState) => state.imageEditDialog.media);
    const posting = useSelector((state: ClientState) =>
        getPosting(state, state.imageEditDialog.media?.captionPostingId ?? null, state.imageEditDialog.nodeName)
    );
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "posting.smileys.enabled") as boolean);

    return (
        <ImageEditDialogOuter
            homeOwnerName={homeOwnerName}
            homeOwnerFullName={homeOwnerFullName}
            media={media}
            posting={posting}
            smileysEnabled={smileysEnabled}
            setMediaCaption={setMediaCaption}
        />
    );
}
