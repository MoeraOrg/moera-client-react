import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PluginProps } from "ui/settings/settings-menu";
import { settingsPluginsDelete } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";

type Props = PluginProps & ConnectedProps<typeof connector>;

const SettingsPluginControls = ({plugin, confirmBox}: Props) => {
    if (!plugin.local || plugin.tokenId == null) {
        return null;
    }

    const onDelete = (e: React.MouseEvent) => {
        confirmBox(`Do you really want to delete the plugin "${plugin.title ?? plugin.name}"?`, "Delete", "Cancel",
            settingsPluginsDelete(plugin.name, plugin.tokenId!), null, "danger");
        e.preventDefault();
    }

    return (
        <button className="delete" title="Delete" onClick={onDelete}>
            <FontAwesomeIcon icon="trash-can"/>
        </button>
    );
}

const connector = connect(
    null,
    { confirmBox }
);

export default connector(SettingsPluginControls);
