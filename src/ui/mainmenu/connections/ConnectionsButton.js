import React from 'react';
import { connect } from 'react-redux';

import { Popover, NodeName } from "ui/control";
import HomeName from "ui/mainmenu/connections/HomeName";

const ConnectionsButton = ({location, owner}) => (
    <Popover element={HomeName}>
        Connected to <a href={location}>{location}</a>
        {owner.name && <><br />Signing as <NodeName {...owner} linked={false}/></>}
    </Popover>
);

export default connect(
    state => ({
        location: state.home.root.location,
        owner: state.home.owner
    })
)(ConnectionsButton);
