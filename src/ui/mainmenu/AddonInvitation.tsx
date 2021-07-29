import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { addDays, isBefore } from 'date-fns';

import { PREFIX } from "api/settings";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getSetting, isSettingsClientValuesLoaded } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";

type Props = ConnectedProps<typeof connector>;

interface State {
    hidden: boolean;
}

class AddonInvitation extends React.Component<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            hidden: false
        }
    }

    onClick = () => {
        const {settingsUpdate} = this.props;

        this.setState({hidden: true});
        settingsUpdate([{
            name: PREFIX + "invitation.addon.shown-at",
            value: String(now())
        }]);
    }

    getHtml() {
        let buf = "For the best Moera experience it is recommended to install ";
        if (Browser.userAgent === "firefox") {
            buf += "<a href=\"https://addons.mozilla.org/en-US/firefox/addon/moera/\">"
                + "the Moera add-on for Firefox</a>";
        } else {
            buf += "<a href=\"https://chrome.google.com/webstore/detail/moera/"
                + "endpkknmpgamhhlojbgifimfcleeeghb\">the Moera add-on for Chrome</a>";
        }
        return buf;
    }

    render() {
        const {standalone, settingsLoaded, shownAt} = this.props;
        const {hidden} = this.state;

        if (!standalone || !Browser.isAddonSupported() || hidden || !settingsLoaded
            || !isBefore(addDays(shownAt, 31), new Date())) {

            return null;
        }

        return (
            <div className="alert alert-primary alert-dismissible mb-0 fade show" role="alert">
                <span dangerouslySetInnerHTML={{__html: this.getHtml()}}/>
                <button type="button" className="close" aria-label="Close" onClick={this.onClick}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

}

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state),
        settingsLoaded: isConnectedToHome(state) && isSettingsClientValuesLoaded(state),
        shownAt: getSetting(state, "invitation.addon.shown-at") as number
    }),
    { settingsUpdate }
);

export default connector(AddonInvitation);
