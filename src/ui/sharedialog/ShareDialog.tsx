import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Field, Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { closeShareDialog, shareDialogCopyLink } from "state/sharedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { Icon, msContentCopy } from "ui/material-symbols";
import CopyQuoteButton from "ui/sharedialog/CopyQuoteButton";
import { SOCIAL_BUTTONS, SOCIAL_BUTTONS_ORDER } from "ui/sharedialog/social-buttons";
import SocialButton from "ui/sharedialog/SocialButton";
import { clearHtml } from "util/html";
import "./ShareDialog.css";

interface OuterProps {
    title: string;
    url: string;
}

interface Values {
    title: string;
    url: string;
}

type Props = OuterProps & FormikProps<Values>

function ShareDialogInner({title, url, values, resetForm}: Props) {
    const socialButtons = useSelector(getSocialButtons);
    const dispatch = useDispatch();

    const {t} = useTranslation();

    useEffect(() => {
        resetForm({
            values: shareDialogLogic.mapPropsToValues({
                title: clearHtml(title),
                url
            })
        });
    }, [title, url, resetForm]);

    const onClose = () => dispatch(closeShareDialog());

    const onCopyLink = () => dispatch(shareDialogCopyLink(values.url));

    return (
        <ModalDialog title={t("share")} className="share-dialog" onClose={onClose}>
            <div className="modal-body">
                <Form>
                    <Field component="textarea" name="title" className="form-control title"
                           placeholder={t("say-about-link")} rows={3}/>
                    <div className="link">
                        <Field type="text" name="url" className="form-control"/>
                        <Button variant="tool-round" onClick={onCopyLink}>
                            <Icon icon={msContentCopy} size={20}/>
                        </Button>
                    </div>
                </Form>
                <div className="social">
                    <CopyQuoteButton url={values.url} title={values.title} mode="text"/>
                    {socialButtons.map(type =>
                        <SocialButton key={type} type={type} url={values.url} title={values.title}/>
                    )}
                </div>
            </div>
        </ModalDialog>
    );
}

const shareDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        title: props.title,
        url: props.url
    }),

    handleSubmit(_: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setSubmitting(false);
    }

}

const getSocialButtons = createSelector(
    (state: ClientState) => getSetting(state, "share.social-buttons.usage") as any as Partial<Record<string, number>>,
    usage => (
        [...SOCIAL_BUTTONS].sort((a, b) => {
            const ua = usage[a] ?? 0;
            const ub = usage[b] ?? 0;
            return ua !== ub ? ub - ua : SOCIAL_BUTTONS_ORDER.get(a)! - SOCIAL_BUTTONS_ORDER.get(b)!;
        })
    )
);

const ShareDialogOuter = withFormik(shareDialogLogic)(ShareDialogInner);

export default function ShareDialog() {
    const title = useSelector((state: ClientState) => state.shareDialog.title);
    const url = useSelector((state: ClientState) => state.shareDialog.url ?? "");

    return <ShareDialogOuter title={title} url={url}/>;
}
