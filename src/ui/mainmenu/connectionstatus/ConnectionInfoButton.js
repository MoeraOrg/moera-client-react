import React from 'react';
import { connect } from 'react-redux';

import { Popover, NodeName } from "ui/control";

const ConnectionInfoButton = ({location, owner}) => (
    <Popover icon="network-wired" textClassName="connection-button" title="Connection details">
        Connected to <a href={location}>{location}</a>
        {owner.name && <><br />Signing as <NodeName {...owner} linked={false}/></>}
    </Popover>
);

export default connect(
    state => ({
        location: state.home.root.location,
        owner: state.home.owner
    })
)(ConnectionInfoButton);
