import React from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, useField, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getHomeOwnerName, getRelNodeNameContext } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { closeRepostDialog, repostPosting } from "state/repostdialog/actions";
import { useDispatcher } from "ui/hook";
import { Button, ModalDialog } from "ui/control";
import { PrincipalField } from "ui/control/field";
import { useNameDisplayMode } from "ui/nodename/hooks";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";
import { formatFullName } from "util/names";

interface OuterProps {
    homeOwnerName: string | null;
    nodeName: string | RelNodeName;
    postingId: string | null;
    postingView: PrincipalValue;
    defaultVisibility: PrincipalValue;
}

interface Values {
    postingView: PrincipalValue;
}

type Props = OuterProps & FormikProps<Values>

function RepostDialogInner({homeOwnerName, nodeName, postingView: originalPostingView}: Props) {
    const nodeNameContext = useSelector(getRelNodeNameContext);
    const heading = useSelector((state: ClientState) => state.repostDialog.heading);
    const fullName = useSelector((state: ClientState) => state.repostDialog.fullName);
    const submitting = useSelector((state: ClientState) => state.repostDialog.submitting);
    const nameDisplayMode = useNameDisplayMode();
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const [, {value: postingView}] = useField<PrincipalValue>("postingView");

    const onClose = () => dispatch(closeRepostDialog());

    const name = formatFullName(absoluteNodeName(nodeName, nodeNameContext), fullName, nameDisplayMode);

    const unethical = nodeName !== homeOwnerName && (
        originalPostingView === "signed"
            ? postingView === "public"
            : originalPostingView !== "public" && postingView !== "private"
    );

    return (
        <ModalDialog title={t("repost")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <p className="form-text">
                        {nodeName === homeOwnerName
                            ? t("repeat-your-post", {heading})
                            : <Trans i18nKey="share-post-your-blog" values={{name, heading}} components={{b: <b/>}}/>}
                    </p>
                    <PrincipalField
                        name="postingView"
                        title={t("repost-visible-to")}
                        values={["public", "signed", "subscribed", "friends", "private"]}
                        long
                        dropdownContainer={document.getElementById("modal-root")}
                    />
                    {unethical && <div className="form-error">{t("sharing-post-unethical")}</div>}
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={submitting}>{t("repost")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const repostDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        postingView: props.homeOwnerName === props.nodeName
            ? props.postingView
            : repostVisibility(props.postingView, props.defaultVisibility)
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {nodeName, postingId} = formik.props;
        if (postingId != null) {
            dispatch(repostPosting(nodeName, postingId, values.postingView));
        }
        formik.setSubmitting(false);
    }

};

function repostVisibility(originalVisibility: PrincipalValue, defaultVisibility: PrincipalValue): PrincipalValue {
    if (originalVisibility === "public") {
        return defaultVisibility;
    }
    if (originalVisibility === "signed") {
        return defaultVisibility === "public" ? "signed" : defaultVisibility;
    }
    return "private";
}

const RepostDialogOuter = withFormik(repostDialogLogic)(RepostDialogInner);

export default function RepostDialog() {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const nodeName = useSelector((state: ClientState) => state.repostDialog.nodeName);
    const postingId = useSelector((state: ClientState) => state.repostDialog.postingId);
    const visible = useSelector((state: ClientState) => state.repostDialog.visible);
    const defaultVisibility = useSelector((state: ClientState) =>
        getSetting(state, "posting.visibility.default") as PrincipalValue
    );

    return <RepostDialogOuter homeOwnerName={homeOwnerName} nodeName={nodeName} postingId={postingId}
                              postingView={visible} defaultVisibility={defaultVisibility}/>;
}
