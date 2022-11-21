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
import { CheckboxField, InputField, PrincipalField } from "ui/control/field";
import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/misc";
import { tGender } from "i18n";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    groups: string[];
    addedGroups: string[];
    addedGroupTitles: string[];
    addedGroupView: string[];
}

type Props = OuterProps & FormikProps<Values>;

function FriendGroupsDialog(props: Props) {
    const {
        show, nodeName, nodeCard, changing, availableGroups, nameDisplayMode, closeFriendGroupsDialog, values
    } = props;
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
        .filter(fg => fg.title !== "t:friends");

    const onAddGroup = () => {
        props.setFieldValue("addedGroupTitles", [...values.addedGroupTitles, ""]);
        props.setFieldValue("addedGroupView", [...values.addedGroupView, "admin"]);
        props.setFieldValue("addedGroups", [...values.addedGroups, String(values.addedGroupTitles.length)]);
    }

    return (
        <ModalDialog title={t("change-friend-groups", {name, gender})} onClose={closeFriendGroupsDialog}>
            <Form>
                <div className="modal-body">
                    {available.map(fg =>
                        <CheckboxField<string[]> key={fg.id} id={`groups_${fg.id}`} name="groups" title={fg.title}
                                                 value={fg.id} isChecked={(v: string[]) => v.includes(fg.id)} anyValue/>
                    )}
                    {values.addedGroupTitles.map((title, index) =>
                        <div key={index} className="d-flex">
                            <CheckboxField<string[]> name="addedGroups" value={String(index)}
                                                     isChecked={(v: string[]) => v.includes(String(index))} anyValue/>
                            <InputField name={`addedGroupTitles[${index}]`} maxLength={63}/>
                            <PrincipalField name={`addedGroupView[${index}]`} values={["public", "private", "admin"]}
                                            groupClassName="ms-1"/>
                        </div>
                    )}
                    <Button variant="outline-secondary" size="sm" onClick={onAddGroup}>{t("add-group")}</Button>
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
        groups: props.nodeCard?.friendship.groups?.map(fg => fg.id) ?? [],
        addedGroups: [],
        addedGroupTitles: [],
        addedGroupView: []
    }),

    validate(values: Values) {
        const errors: string[] = [];
        values.addedGroups.forEach(g => {
            const index = parseInt(g);
            if (!values.addedGroupTitles[index]) {
                errors[index] = "must-not-empty";
            }
        });
        return errors.length > 0 ? {addedGroupTitles: errors} : {};
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        if (formik.props.nodeName != null) {
            formik.props.nodeChangeFriendGroups(formik.props.nodeName, values.groups,
                values.addedGroups.map(g => parseInt(g)), values.addedGroupTitles, values.addedGroupView);
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