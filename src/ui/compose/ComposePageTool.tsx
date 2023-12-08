import { useSelector } from 'react-redux';
import { useField } from 'formik';

import { isComposeReady } from "state/compose/selectors";
import { ComposePageToolsTab } from "ui/compose/posting-compose";

interface Props {
    name: string;
    children: any;
}

export default function ComposePageTool({name, children}: Props) {
    const ready = useSelector(isComposeReady);
    const [, {value}] = useField<ComposePageToolsTab>("toolsTab");

    if (!ready || value !== name) {
        return null;
    }

    return children;
}
