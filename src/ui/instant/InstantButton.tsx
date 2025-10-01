import React, { Suspense } from 'react';

import { Popover } from "ui/control";
import InstantBell from "ui/instant/InstantBell";
import { useInstantsToggler } from "ui/instant/instants-toggler";

const InstantsPopover = React.lazy(() => import("ui/instant/InstantsPopover"));

export default function InstantButton() {
    const {border, onToggle} = useInstantsToggler();

    return (
        <Suspense fallback={<InstantBell/>}>
            <Popover
                text={<InstantBell/>}
                className="instant-popover"
                detached
                placement="bottom-end"
                offset={[0, 15]}
                onToggle={onToggle}
            >
                <InstantsPopover instantBorder={border}/>
            </Popover>
        </Suspense>
    );
}
