import React from 'react';
import { useField } from 'formik';

import DonateEditor from "ui/profile/edit/donate/DonateEditor";
import { FormGroup } from "ui/control";
import { FundraiserInfo } from "api/node/api-types";

interface Props {
    name: string;
    title?: string;
    groupClassName?: string;
    labelClassName?: string;
}

export default function DonateField({name, title, groupClassName, labelClassName}: Props) {
    const [{value}, {touched, error}, {setValue}] = useField<FundraiserInfo[]>(name);

    return (
        <FormGroup
            title={title}
            name={name}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
        >
            <>
                <DonateEditor value={value} setValue={setValue}/>
                {touched && error && <div className="invalid-feedback">{error}</div>}
            </>
        </FormGroup>
    );
}
