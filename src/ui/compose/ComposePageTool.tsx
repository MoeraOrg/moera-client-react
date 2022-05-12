import { useField } from 'formik';

import { ComposePageToolsTab } from "ui/compose/compose-page-logic";

interface Props {
    name: string;
    children: any;
}

export default function ComposePageTool({name, children}: Props) {
    const [, {value}] = useField<ComposePageToolsTab>("toolsTab");

    if (value !== name) {
        return null;
    }

    return children;
}
