import React from 'react';
import { connect } from 'react-redux';
import { addDays, isBefore } from 'date-fns';

import { PREFIX } from "api/settings";
import { isConnectedToHome } from "state/home/selectors";
import { getSetting, isSettingsClientValuesLoaded } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { now } from "util/misc";

class AddonInvitation extends React.Component {

    state = {
        hidden: false
    }

    onClick = () => {
        const {settingsUpdate} = this.props;

        this.setState({hidden: true});
        settingsUpdate([{
            name: PREFIX + "invitation.addon.shown-at",
            value: String(now())
        }]);
    }

    render() {
        const {standalone, settingsLoaded, shownAt} = this.props;
        const {hidden} = this.state;

        if (!standalone || hidden || !settingsLoaded || !isBefore(addDays(shownAt, 31), new Date())) {
            return null;
        }

        return (
            <div className="alert alert-primary alert-dismissible fade show" role="alert">
                Install addon!
                <button type="button" className="close" aria-label="Close">
                    <span aria-hidden="true" onClick={this.onClick}>&times;</span>
                </button>
            </div>
        );
    }

}

export default connect(
    state => ({
        standalone: isStandaloneMode(state),
        settingsLoaded: isConnectedToHome(state) && isSettingsClientValuesLoaded(state),
        shownAt: getSetting(state, "invitation.addon.shown-at")
    }),
    { settingsUpdate }
)(AddonInvitation);
