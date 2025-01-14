import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { composePreview } from "state/compose/actions";
import { Icon, msKeyboardArrowDown, msKeyboardArrowUp, msPreview } from "ui/material-symbols";
import { Button, DropdownMenu } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";
import "./ComposeSubmitButton.css";

interface Props {
    loading: boolean;
    update: boolean;
    disabled: boolean;
}

export default function ComposeSubmitButton({loading, update, disabled}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onPreview = () =>
        dispatch(composePreview());

    return (
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
                    show: true
                },
            ]} className="btn btn-primary submit-menu-button" disabled={disabled}>
                {visible => <Icon icon={visible ? msKeyboardArrowUp : msKeyboardArrowDown}/>}
            </DropdownMenu>
        </div>
    );
}
