import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Browser } from "api/browser";
import { getAddonApiVersion } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { Popover, NodeName } from "ui/control";
import HomeName from "ui/mainmenu/connections/HomeName";
import "./ConnectionsButton.css";

class ConnectionsButton extends React.PureComponent {

    onAddClick = (hide) => () => {
        this.props.openConnectDialog();
        hide();
    };

    onItemClick = (location, hide) => () => {
        Browser.switchData(location);
        hide();
    };

    render() {
        const {addonApiVersion, location, owner, roots} = this.props;

        return (
            <Popover element={HomeName}>
                {({hide}) => (
                    <div id="connections">
                        {roots.map(root => (
                            root.url === location ?
                                <div className="connection active" key={root.url}>
                                    <NodeName {...owner} linked={false}/><br/>
                                    {location}<br/>
                                    <span className="connected">Connected</span>
                                </div>
                            :
                                <div className="connection" key={root.url} onClick={this.onItemClick(root.url, hide)}>
                                    {root.url}
                                </div>
                        ))}
                        {addonApiVersion >= 2 &&
                            <div className="connection-add" onClick={this.onAddClick(hide)}>
                                <FontAwesomeIcon icon="plus"/>
                                {" "}Add connection
                            </div>
                        }
                    </div>
                )}
            </Popover>
        );
    }

}

export default connect(
    state => ({
        addonApiVersion: getAddonApiVersion(state),
        location: state.home.root.location,
        owner: state.home.owner,
        roots: state.home.roots
    }),
    { openConnectDialog }
)(ConnectionsButton);
