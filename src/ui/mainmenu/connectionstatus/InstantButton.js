import React from 'react';

import { Popover } from "ui/control";
import InstantBell from "ui/mainmenu/connectionstatus/InstantBell";
import Instants from "ui/instant/Instants";

const InstantButton = () => (
    <Popover element={InstantBell}>
        {({hide, update}) => (
            <Instants hide={hide} update={update}/>
        )}
    </Popover>
);

export default InstantButton;
