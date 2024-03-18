import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { getSetting } from "state/settings/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { closeImageEditDialog, imageEditDialogPost } from "state/imageeditdialog/actions";
import { Button, ModalDialog } from "ui/control";
import { RichTextField, RichTextValue } from "ui/control/richtexteditor";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import { replaceSmileys } from "util/text";
import { urlWithParameters } from "util/url";
import store from "state/store";
import "./ImageEditDialog.css";

interface OuterProps {
    homeOwnerName: string | null;
    homeOwnerFullName: string | null;
    posting: ExtPostingInfo | null;
    smileysEnabled: boolean;
}

interface Values {
    caption: RichTextValue;
}

type Props = OuterProps & FormikProps<Values>;

function ImageEditDialogInner(props: Props) {
    const {posting, smileysEnabled, resetForm} = props;

    const media = useSelector((state: ClientState) => state.imageEditDialog.media);
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, state.imageEditDialog.nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);
    const loading = useSelector((state: ClientState) => state.imageEditDialog.loading);
    const saving = useSelector((state: ClientState) => state.imageEditDialog.saving);
    const dispatch = useDispatch();
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

    const auth = carte != null ? "carte:" + carte : null;
    const src = mediaImagePreview(urlWithParameters(rootPage + "/media/" + media.path, {auth}), 800);
    const [imageWidth, imageHeight] = mediaImageSize(800, null, null, media);

    return (
        <ModalDialog title={t("edit-image")} loading={loading} onClose={onClose}>
            <Form>
                <div className="modal-body image-edit-dialog">
                    <img className="preview" alt="" src={src} width={imageWidth} height={imageHeight}/>
                    <RichTextField name="caption" format={posting?.bodySrcFormat || "markdown"} maxHeight="14em"
                                   smileysEnabled={smileysEnabled} anyValue noMedia autoFocus/>
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
        caption: new RichTextValue(props.posting?.bodySrc?.text ?? "")
    }),

    _replaceSmileys(enabled: boolean, text: string): string {
        return enabled ? replaceSmileys(text) : text;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        store.dispatch(imageEditDialogPost({
            ownerName: formik.props.homeOwnerName,
            ownerFullName: formik.props.homeOwnerFullName,
            bodySrc: JSON.stringify({
                text: this._replaceSmileys(formik.props.smileysEnabled, values.caption.text.trim())
            }),
            bodySrcFormat: formik.props.posting?.bodySrcFormat || "markdown"
        }));
        formik.setSubmitting(false);
    }

};

const ImageEditDialogOuter = withFormik(logic)(ImageEditDialogInner);

export default function ImageEditDialog() {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const homeOwnerFullName = useSelector(getHomeOwnerFullName);
    const posting = useSelector((state: ClientState) =>
        getPosting(state, state.imageEditDialog.media?.postingId ?? null, state.imageEditDialog.nodeName));
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "posting.smileys.enabled") as boolean);

    return <ImageEditDialogOuter homeOwnerName={homeOwnerName} homeOwnerFullName={homeOwnerFullName} posting={posting}
                                 smileysEnabled={smileysEnabled}/>;
}
