import React from 'react';

import { Popover } from "ui/control";
import HomeName from "ui/mainmenu/connections/HomeName";
import Connections from "ui/mainmenu/connections/Connections";

const ConnectionsButton = () => (
    <Popover element={HomeName}>
        {({hide, update}) => (
            <Connections hide={hide} update={update}/>
        )}
    </Popover>
);

export default ConnectionsButton;
