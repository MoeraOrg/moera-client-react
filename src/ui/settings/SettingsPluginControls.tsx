import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { settingsPluginsDelete } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";
import { PluginProps } from "ui/settings/settings-menu";

type Props = PluginProps & ConnectedProps<typeof connector>;

const SettingsPluginControls = ({plugin, confirmBox}: Props) => {
    const {t} = useTranslation();

    if (!plugin.local || plugin.tokenId == null) {
        return null;
    }

    const onDelete = (e: React.MouseEvent) => {
        confirmBox(t("want-delete-addon", {name: plugin.title ?? plugin.name}), t("delete"), t("cancel"),
            settingsPluginsDelete(plugin.name, plugin.tokenId!), null, "danger");
        e.preventDefault();
    }

    return (
        <button className="delete" title={t("delete")} onClick={onDelete}>
            <FontAwesomeIcon icon="trash-can"/>
        </button>
    );
}

const connector = connect(
    null,
    { confirmBox }
);

export default connector(SettingsPluginControls);
