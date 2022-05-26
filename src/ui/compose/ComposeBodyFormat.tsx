import React from 'react';

import { Choice, SourceFormat } from "api/node/api-types";
import { SelectField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

interface Props {
    sourceFormats: Choice<SourceFormat>[];
}

const ComposeBodyFormat = ({sourceFormats}: Props) => (
    <ComposePageTool name="format">
        <SelectField title="Text formatting" name="bodyFormat" horizontal layout="left" groupClassName="ps-2"
                     col="col-md-2" choices={sourceFormats.filter(c => c.value !== "application")} anyValue
                     setting="posting.body-src-format.default"/>
    </ComposePageTool>
);

export default ComposeBodyFormat;
