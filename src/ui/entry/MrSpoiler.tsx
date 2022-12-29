import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import "./MrSpoiler.css";

interface Props {
    title?: string;
    children?: any;
}

export default function MrSpoiler({title, children}: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const {t} = useTranslation();

    const onClick = () => setOpen(true);

    if (open) {
        return <>{children}</>;
    } else {
        return <button className="spoiler" onClick={onClick}>{title ?? t("spoiler-alert")}</button>;
    }
}
