import React from 'react';
import { useField } from 'formik';

import { PrincipalSelect } from "ui/control/PrincipalSelect";

interface Props {
    name: string;
}

export function PrincipalField({name}: Props) {
    const [, {value}, {setValue}] = useField<string>(name);

    return (
        <PrincipalSelect value={value} onChange={v => setValue(v)}/>
    );
}
