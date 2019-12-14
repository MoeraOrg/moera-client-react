import React from 'react';
import { connect } from 'react-redux';

import { Popover, NodeName } from "ui/control";

const ConnectionInfoButton = ({location, login, owner}) => (
    <Popover icon="network-wired" textClassName="connection-button" title="Connection details">
        Connected to <a href={location}>{location}</a> as <b>{login}</b>
        {owner.name && <><br />Signing as <NodeName {...owner} linked={false}/></>}
    </Popover>
);

export default connect(
    state => ({
        location: state.home.root.location,
        login: state.home.login,
        owner: state.home.owner
    })
)(ConnectionInfoButton);
