import React from 'react';
import { useSelector } from 'react-redux';

import { isComposeReady } from "state/compose/selectors";
import { PrincipalField } from "ui/control/field";

const ComposeViewPrincipal = () => {
    const ready = useSelector(isComposeReady);

    return (
        <div className="ms-2 mt-1">
            <PrincipalField name="viewPrincipal" values={["public", "signed", "subscribed", "friends", "private"]} long
                            setting="posting.visibility.default" disabled={!ready}/>
        </div>
    );
}

export default ComposeViewPrincipal;
