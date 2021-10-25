import React from 'react';

import { Popover } from "ui/control";
import HomeName from "ui/mainmenu/connections/HomeName";
import Connections from "ui/mainmenu/connections/Connections";

const ConnectionsButton = () => (
    <Popover element={HomeName} detached>
        {({hide}) => (
            <Connections hide={hide}/>
        )}
    </Popover>
);

export default ConnectionsButton;
