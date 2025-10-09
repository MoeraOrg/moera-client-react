import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { GrantInfo, NodeName as NodeNameUtil } from "api";
import { ClientState } from "state/state";
import { settingsGrantsDelete, settingsGrantsDialogOpen } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button, Loading } from "ui/control";
import { Icon, msDelete, msEdit, msPublic } from "ui/material-symbols";
import NodeName from "ui/nodename/NodeName";
import GrantDialog from "ui/settings/GrantDialog";

export default function SettingsItemGrants() {
    const loading = useSelector((state: ClientState) => state.settings.grants.loading);
    const loaded = useSelector((state: ClientState) => state.settings.grants.loaded);
    const grants = useSelector((state: ClientState) => state.settings.grants.grants);
    const showDialog = useSelector((state: ClientState) => state.settings.grants.dialog.show);
    const dispatch = useDispatch();

    const {t} = useTranslation();

    const onEdit = (grant: GrantInfo) => (e: React.MouseEvent) => {
        dispatch(settingsGrantsDialogOpen(grant.nodeName, grant));
        e.preventDefault();
    };

    const onDelete = (grant: GrantInfo) => (e: React.MouseEvent) => {
        dispatch(confirmBox({
            message: t("want-revoke-permissions", {name: NodeNameUtil.shorten(grant.nodeName)}),
            yes: t("yes"),
            no: t("cancel"),
            onYes: settingsGrantsDelete(grant.nodeName),
            variant: "danger"
        }));
        e.preventDefault();
    };

    return (
        <>
            {loading && <Loading/>}
            {(loaded && grants.length === 0) && <i>{t("no-applications")}</i>}
            {grants.map(g =>
                <div className="token-info" key={g.nodeName}>
                    <Icon icon={msPublic} className="icon me-2"/>
                    <NodeName name={g.nodeName} popup={false}/>
                    <Button variant="silent" className="token-button ms-3" title={t("change")} onClick={onEdit(g)}>
                        <Icon icon={msEdit} size="1.2em"/>
                    </Button>
                    <Button variant="silent" className="token-button red" title={t("delete")} onClick={onDelete(g)}>
                        <Icon icon={msDelete} size="1.2em"/>
                    </Button>
                </div>
            )}
            {showDialog && <GrantDialog/>}
        </>
    )
}
