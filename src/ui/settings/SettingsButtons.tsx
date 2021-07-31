import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormikContext } from 'formik';

import { Button } from "ui/control";
import "./SettingsButtons.css";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

function SettingsButtons({updating}: Props) {
    const {dirty, handleReset} = useFormikContext();

    return (
        <div className="settings-buttons">
            <Button variant="secondary" className="col-sm-2 col-5" disabled={!dirty} onClick={handleReset}>
                Cancel
            </Button>
            <Button variant="primary" type="submit" className="col-sm-2 col-5" disabled={!dirty} loading={updating}>
                Save
            </Button>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        updating: state.settings.updating
    })
);

export default connector(SettingsButtons);
