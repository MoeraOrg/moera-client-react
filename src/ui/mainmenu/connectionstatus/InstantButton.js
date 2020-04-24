import React from 'react';

import { Popover } from "ui/control";
import InstantBell from "ui/mainmenu/connectionstatus/InstantBell";
import Instants from "ui/instant/Instants";

const InstantButton = () => (
    <Popover element={InstantBell}>
        <Instants/>
    </Popover>
);

export default InstantButton;
