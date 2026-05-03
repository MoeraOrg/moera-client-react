import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { MediaCaption } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getNamingNameRoot } from "state/naming/selectors";
import { getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { closeImageEditDialog } from "state/imageeditdialog/actions";
import { useDispatcher } from "ui/hook";
import { Button, ModalDialog } from "ui/control";
import { MediaFileWithCaption, RichTextField, RichTextValue } from "ui/control/richtexteditor";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { mediaImageTagAttributes } from "util/media-images";
import "./ImageEditDialog.css";

interface OuterProps {
    homeOwnerName: string | null;
    homeOwnerFullName: string | null;
    media: MediaFileWithCaption | null;
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
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, state.imageEditDialog.nodeName));
    const loading = useSelector((state: ClientState) => state.imageEditDialog.loading);
    const saving = useSelector((state: ClientState) => state.imageEditDialog.saving);
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    useEffect(() => {
        const values = logic.mapPropsToValues(props);
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posting, resetForm]); // 'props' are missing on purpose

    if (media == null) {
        return null;
    }

    const onClose = () => dispatch(closeImageEditDialog());

    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = mediaImageTagAttributes(rootPage, media, 800);

    return (
        <ModalDialog title={t("edit-image")} parentOverlayId={parentOverlayId} loading={loading} onClose={onClose}>
            <Form>
                <div className="modal-body image-edit-dialog">
                    <img className="preview" alt={alt ?? ""} src={src} srcSet={srcSet} sizes={sizes}
                         width={imageWidth} height={imageHeight}/>
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
        if (formik.props.media?.id != null) {
            formik.props.setMediaCaption(
                formik.props.media?.id,
                {
                    mediaId: formik.props.media.id,
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
