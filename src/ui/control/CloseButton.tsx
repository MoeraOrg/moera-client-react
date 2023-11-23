import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    onClick?: MouseEventHandler | null;
}

export function CloseButton({onClick}: Props) {
    const {t} = useTranslation();

    return (
        <button type="button" className="btn-close" title={t("close")} aria-label={t("close")}
                onClick={onClick ?? undefined}/>
    );
}
