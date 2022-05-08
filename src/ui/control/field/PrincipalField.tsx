import React from 'react';
import { useField } from 'formik';

import { PrincipalSelect } from "ui/control/PrincipalSelect";

interface Props {
    name: string;
    long?: boolean | null;
}

export function PrincipalField({name, long}: Props) {
    const [, {value}, {setValue}] = useField<string>(name);

    return (
        <PrincipalSelect value={value} long={long} onChange={v => setValue(v)}/>
    );
}
