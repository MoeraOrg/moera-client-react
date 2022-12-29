import React from 'react';
import { PrincipalField } from "ui/control/field";

const ComposeViewPrincipal = () => (
    <div className="ms-2">
        <PrincipalField name="viewPrincipal" values={["public", "signed", "subscribed", "friends", "private"]} long
                        setting="posting.visibility.default"/>
    </div>
);

export default ComposeViewPrincipal;
