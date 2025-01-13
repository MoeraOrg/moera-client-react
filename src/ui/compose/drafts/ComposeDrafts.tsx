import React from 'react';

import ComposeDraftSaver from "ui/compose/drafts/ComposeDraftSaver";
import ComposeResetButton from "ui/compose/drafts/ComposeResetButton";
import ComposeDraftSelector from "ui/compose/drafts/ComposeDraftSelector";
import "./ComposeDrafts.css";

interface Props {
    ready: boolean;
}

const ComposeDrafts = ({ready}: Props) => (
    <div className="drafts">
        {ready && <ComposeDraftSaver/>}
        <ComposeResetButton/>
        <ComposeDraftSelector/>
    </div>
);

export default ComposeDrafts;
