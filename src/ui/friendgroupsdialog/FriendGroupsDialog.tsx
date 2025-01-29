import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { tGender } from "i18n";
import { FriendGroupInfo, PrincipalValue } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getHomeFriendGroups } from "state/home/selectors";
import { NodeCardState } from "state/nodecards/state";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { closeFriendGroupsDialog, nodeChangeFriendGroups } from "state/friendgroupsdialog/actions";
import { peopleSelectedChangeFriendGroups } from "state/people/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField, InputField, PrincipalField } from "ui/control/field";
import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/names";
import "./FriendGroupsDialog.css";

interface OuterProps {
    nodeName: string | null;
    nodeCard: NodeCardState | null;
    availableGroups: FriendGroupInfo[];
}

type TitledFriendGroupInfo = Omit<FriendGroupInfo, "title"> & { title: string };

interface Values {
    groups: string[];
    touchedGroups: string[];
    addedGroups: string[];
    addedGroupTitles: string[];
    addedGroupView: PrincipalValue[];
    availableGroups: TitledFriendGroupInfo[];
}

type Props = OuterProps & FormikProps<Values>;

function FriendGroupsDialogInner({nodeName, nodeCard, values, setFieldValue}: Props) {
    const changing = useSelector((state: ClientState) => state.friendGroupsDialog.changing);
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display") as NameDisplayMode);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const name = formatFullName(nodeName, nodeCard?.details.profile.fullName, nameDisplayMode);
    const gender = tGender(nodeCard?.details.profile.gender);

    const isGroupChecked = (id: string) => (v: string[]): boolean | null =>
        nodeName != null ? v.includes(id) : (values.touchedGroups.includes(id) ? v.includes(id) : null);

    const onAddGroup = () => {
        setFieldValue("addedGroupTitles", [...values.addedGroupTitles, ""]);
        setFieldValue("addedGroupView", [...values.addedGroupView, "admin"]);
        setFieldValue("addedGroups", [...values.addedGroups, String(values.addedGroupTitles.length)]);
    }

    const onGroupChecked = (id: string) => () => {
        const touched = values["touchedGroups"];
        if (!touched.includes(id)) {
            setFieldValue("touchedGroups", [...touched, id]);
        }
    }

    const onClose = () => dispatch(closeFriendGroupsDialog());

    return (
        <ModalDialog title={nodeName != null ? t("change-friend-groups", {name, gender}) : t("change-groups")}
                     className="friend-groups-dialog" onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {values.availableGroups.map(fg =>
                        <CheckboxField<string[]> key={fg.id} id={`groups_${fg.id}`} name="groups" title={fg.title}
                                                 value={fg.id} isChecked={isGroupChecked(fg.id)}
                                                 onChange={onGroupChecked(fg.id)} anyValue/>
                    )}
                    {values.addedGroupTitles.map((title, index) =>
                        <div key={index} className="d-flex">
                            <CheckboxField<string[]> name="addedGroups" value={String(index)}
                                                     isChecked={(v: string[]) => v.includes(String(index))} anyValue/>
                            <InputField name={`addedGroupTitles[${index}]`} maxLength={63}
                                        groupClassName="add-group-name"/>
                            <PrincipalField name={`addedGroupView[${index}]`} values={["public", "private", "admin"]}
                                            titles={{
                                                "public": t("friend-group-visibility.public"),
                                                "private": t("friend-group-visibility.private"),
                                                "admin": t("friend-group-visibility.admin")
                                            }} caption={t("visibility")}/>
                        </div>
                    )}
                    <Button variant="outline-secondary" size="sm" onClick={onAddGroup}>{t("add-group")}</Button>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={changing}>{t("change")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const friendGroupsDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        groups: props.nodeCard?.friendship.groups?.map(fg => fg.id) ?? [],
        touchedGroups: [],
        addedGroups: [],
        addedGroupTitles: [],
        addedGroupView: [],
        availableGroups: (props.availableGroups ?? [])
            .filter(fg => fg.title !== "t:friends")
            .filter((fg): fg is TitledFriendGroupInfo => fg.title != null)
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
            const prevGroups = formik.props.nodeCard?.friendship.groups;
            const view: PrincipalValue = prevGroups != null && prevGroups.length > 0
                ? (prevGroups[0].operations?.view ?? "public")
                : "public";
            dispatch(nodeChangeFriendGroups(formik.props.nodeName, values.groups, view,
                values.addedGroups.map(g => parseInt(g)), values.addedGroupTitles, values.addedGroupView));
        } else {
            dispatch(closeFriendGroupsDialog());
            const excludedGroups = values.touchedGroups.filter(g => !values.addedGroups.includes(g));
            dispatch(peopleSelectedChangeFriendGroups(values.groups, excludedGroups,
                values.addedGroups.map(g => parseInt(g)), values.addedGroupTitles, values.addedGroupView));
        }
        formik.setSubmitting(false);
    }

};

const FriendGroupsDialogOuter = withFormik(friendGroupsDialogLogic)(FriendGroupsDialogInner);

export default function FriendGroupsDialog() {
    const nodeName = useSelector((state: ClientState) => state.friendGroupsDialog.nodeName);
    const nodeCard = useSelector((state: ClientState) => getNodeCard(state, state.friendGroupsDialog.nodeName));
    const availableGroups = useSelector(getHomeFriendGroups);

    return <FriendGroupsDialogOuter nodeName={nodeName} nodeCard={nodeCard} availableGroups={availableGroups}/>;
}
