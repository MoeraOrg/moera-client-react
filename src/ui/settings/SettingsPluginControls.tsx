import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { settingsPluginsDelete } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";
import { PluginProps } from "ui/settings/settings-menu";

type Props = PluginProps;

export default function SettingsPluginControls({plugin}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!plugin.local || plugin.tokenId == null) {
        return null;
    }

    const onDelete = (e: React.MouseEvent) => {
        dispatch(confirmBox({
            message: t("want-delete-addon", {name: plugin.title ?? plugin.name}),
            yes: t("delete"),
            no: t("cancel"),
            onYes: settingsPluginsDelete(plugin.name, plugin.tokenId!),
            variant: "danger"
        }));
        e.preventDefault();
    }

    return (
        <button className="delete" title={t("delete")} onClick={onDelete}>
            <FontAwesomeIcon icon={faTrashCan}/>
        </button>
    );
}
