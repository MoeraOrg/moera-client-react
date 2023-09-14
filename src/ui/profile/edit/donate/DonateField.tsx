import React from 'react';
import { useField } from 'formik';

import { FundraiserInfo } from "api";
import { FormGroup } from "ui/control";
import FieldError from "ui/control/field/FieldError";
import DonateEditor from "ui/profile/edit/donate/DonateEditor";

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
                {touched && <FieldError error={error}/>}
            </>
        </FormGroup>
    );
}
