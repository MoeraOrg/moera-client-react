import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeFriendGroups } from "state/home/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { closeFriendGroupsDialog, nodeChangeFriendGroups } from "state/friendgroupsdialog/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";
import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/misc";
import { tGender } from "i18n";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    groups: string[];
}

type Props = OuterProps & FormikProps<Values>;

function FriendGroupsDialog(props: Props) {
    const {show, nodeName, nodeCard, changing, availableGroups, nameDisplayMode, closeFriendGroupsDialog} = props;
    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            const values = friendGroupsDialogLogic.mapPropsToValues(props);
            props.resetForm({values});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, nodeName]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    const name = formatFullName(nodeName, nodeCard?.details.profile.fullName, nameDisplayMode);
    const gender = tGender(nodeCard?.details.profile.gender);
    const available = (availableGroups ?? [])
        .filter(fg => fg.title !== "t:friends")
        .sort((a, b) => a.createdAt - b.createdAt);

    return (
        <ModalDialog title={t("change-friend-groups", {name, gender})} onClose={closeFriendGroupsDialog}>
            <Form>
                <div className="modal-body">
                    {available.map(fg =>
                        <CheckboxField<string[]> key={fg.id} name="groups" title={fg.title} value={fg.id}
                                                 isChecked={(v: string[]) => v.includes(fg.id)} anyValue/>
                    )}
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeFriendGroupsDialog}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={changing}>{t("change")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const friendGroupsDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        groups: props.nodeCard?.friendship.groups?.map(fg => fg.id) ?? []
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        if (formik.props.nodeName != null) {
            const friendsId = formik.props.availableGroups.find(fg => fg.title === "t:friends")?.id;
            const groups = friendsId != null ? [...values.groups, friendsId] : values.groups;
            formik.props.nodeChangeFriendGroups(formik.props.nodeName, groups);
        }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.friendGroupsDialog.show,
        nodeName: state.friendGroupsDialog.nodeName,
        nodeCard: state.friendGroupsDialog.nodeName != null
            ? getNodeCard(state, state.friendGroupsDialog.nodeName)
            : null,
        changing: state.friendGroupsDialog.changing,
        availableGroups: getHomeFriendGroups(state),
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeFriendGroupsDialog, nodeChangeFriendGroups }
);

export default connector(withFormik(friendGroupsDialogLogic)(FriendGroupsDialog));
