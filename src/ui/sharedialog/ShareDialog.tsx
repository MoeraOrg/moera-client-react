import React, { MouseEvent, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';
import { Field, Form, FormikBag, FormikProps, withFormik } from 'formik';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { ShareTextMode } from "ui/sharedialog/share-text-mode";
import CopyQuoteButton from "ui/sharedialog/CopyQuoteButton";
import { SOCIAL_BUTTONS, SOCIAL_BUTTONS_ORDER } from "ui/sharedialog/social-buttons";
import SocialButton from "ui/sharedialog/SocialButton";
import { closeShareDialog, shareDialogCopyLink } from "state/sharedialog/actions";
import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import { clearHtml } from "util/html";
import "./ShareDialog.css";

interface ModeTab {
    mode: ShareTextMode;
    title: string;
}

const MODE_TABS: ModeTab[] = [
    {
        mode: "text",
        title: "Text"
    },
    {
        mode: "html",
        title: "HTML"
    }
];

interface MapToValuesProps {
    title: string;
    url: string;
}

type OuterProps = MapToValuesProps & ConnectedProps<typeof connector>;

interface Values {
    title: string;
    url: string;
}

type Props = OuterProps & FormikProps<Values>

const ShareDialog = ({
    show, title, url, socialButtons, closeShareDialog, shareDialogCopyLink, values, resetForm
}: Props) => {
    const [mode, setMode] = useState("text" as ShareTextMode);
    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({
                values: shareDialogLogic.mapPropsToValues({
                    title: mode === "text" ? clearHtml(title) : title,
                    url
                })
            });
        }
    }, [show, mode, title, url, resetForm]);

    if (!show) {
        return null;
    }

    const onModeClick = (mode: ShareTextMode) => (event: MouseEvent) => {
        setMode(mode);
        event.preventDefault();
    }

    return (
        <ModalDialog title={t("share")} className="share-dialog" onClose={closeShareDialog}>
            <div className="modal-body">
                <ul className="nav nav-pills">
                    {MODE_TABS.map(({mode: mod, title}) => (
                        <li className="nav-item">
                            {/* FIXME Bootstrap requires <a> here */}
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a key={mod} className={cx("nav-link", {"active": mod === mode})} href="#"
                               onClick={onModeClick(mod)}>{title}</a>
                        </li>
                    ))}
                </ul>
                <Form>
                    <Field component="textarea" name="title" className="form-control title" rows={4}/>
                    <div className="link">
                        <Field type="text" name="url" className="form-control"/>
                        <Button variant="secondary" onClick={() => shareDialogCopyLink(values.url)}>{t("copy")}</Button>
                    </div>
                </Form>
                <div className="social">
                    <CopyQuoteButton url={values.url} title={values.title} mode={mode}/>
                    {socialButtons.map(type =>
                        <SocialButton key={type} type={type} url={values.url} title={values.title}/>
                    )}
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={closeShareDialog}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
};

const shareDialogLogic = {

    mapPropsToValues: (props: MapToValuesProps): Values => ({
        title: props.title,
        url: props.url
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
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

const connector = connect(
    (state: ClientState) => ({
        show: state.shareDialog.show,
        title: state.shareDialog.title,
        url: state.shareDialog.url ?? "",
        socialButtons: getSocialButtons(state)
    }),
    { closeShareDialog, shareDialogCopyLink }
);

export default connector(withFormik(shareDialogLogic)(ShareDialog));
