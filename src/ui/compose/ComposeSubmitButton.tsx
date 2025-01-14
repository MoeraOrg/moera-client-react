import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { composePreview } from "state/compose/actions";
import { Icon, msBadge, msKeyboardArrowDown, msKeyboardArrowUp, msPreview, msSchedule } from "ui/material-symbols";
import { Button, DropdownMenu } from "ui/control";
import ChangePublishDateDialog from "ui/compose/ChangePublishDateDialog";
import ChangeFullNameDialog from "ui/compose/ChangeFullNameDialog";
import { REL_CURRENT } from "util/rel-node-name";
import "./ComposeSubmitButton.css";

interface Props {
    loading: boolean;
    update: boolean;
    disabled: boolean;
}

export default function ComposeSubmitButton({loading, update, disabled}: Props) {
    const [showChangePublishDateDialog, setShowChangePublishDateDialog] = React.useState<boolean>(false);
    const [, {value: defaultPublishAt}] = useField<Date>("publishAtDefault");
    const [, {value: publishAt}, {setValue: setPublishAt}] = useField<Date>("publishAt");
    const [showChangeFullNameDialog, setShowChangeFullNameDialog] = React.useState<boolean>(false);
    const [, {value: fullName, initialValue: defaultFullName}, {setValue: setFullName}] = useField<string>("fullName");

    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onPreview = () =>
        dispatch(composePreview());

    const onChangePublishDate = () =>
        setShowChangePublishDateDialog(true);

    const onChangePublishDateSubmit = (ok: boolean, publishAt?: Date) => {
        setShowChangePublishDateDialog(false);

        if (ok && publishAt != null) {
            setPublishAt(publishAt);
        }
    }

    const onChangeFullName = () =>
        setShowChangeFullNameDialog(true);

    const onChangeFullNameSubmit = (ok: boolean, fullName?: string) => {
        setShowChangeFullNameDialog(false);

        if (ok && fullName != null) {
            setFullName(fullName);
        }
    }

    return (
        <>
            <div className="btn-group d-flex" role="group">
                <Button variant="primary" className="submit-button" type="submit" loading={loading} disabled={disabled}>
                    {!update ? t("post-button") : t("update")}
                </Button>
                <DropdownMenu items={[
                    {
                        icon: msPreview,
                        title: t("post-preview"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onPreview,
                        show: !disabled
                    },
                    {
                        divider: true
                    },
                    {
                        icon: msSchedule,
                        title: t("change-date-time"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onChangePublishDate,
                        show: !update
                    },
                    {
                        icon: msBadge,
                        title: t("change-author-name"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onChangeFullName,
                        show: true
                    },
                ]} className="btn btn-primary submit-menu-button">
                    {visible => <Icon icon={visible ? msKeyboardArrowUp : msKeyboardArrowDown}/>}
                </DropdownMenu>
            </div>
            {showChangePublishDateDialog &&
                <ChangePublishDateDialog publishAt={publishAt} defaultPublishAt={defaultPublishAt}
                                         onSubmit={onChangePublishDateSubmit}/>
            }
            {showChangeFullNameDialog &&
                <ChangeFullNameDialog fullName={fullName} defaultFullName={defaultFullName ?? ""}
                                      onSubmit={onChangeFullNameSubmit}/>
            }
        </>
    );
}
