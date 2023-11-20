import { useField } from 'formik';

import { ComposePageToolsTab } from "ui/compose/posting-compose";

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
