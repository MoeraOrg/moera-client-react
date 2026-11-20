import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import "./MrSpoiler.css";

interface Props {
    block?: boolean;
    title?: string;
    children?: any;
}

export default function MrSpoiler({block = false, title, children}: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const {t} = useTranslation();

    const onClick = () => setOpen(true);

    if (open) {
        return <>{children}</>;
    } else {
        return <button className={cx("spoiler", {block})} onClick={onClick}>{title ?? t("spoiler-alert")}</button>;
    }
}
