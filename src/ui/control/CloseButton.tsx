import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    onClick?: MouseEventHandler | null;
}

export const CloseButton = ({onClick}: Props) => {
    const {t} = useTranslation();

    return (
        <button type="button" className="btn-close" aria-label={t("close")} onClick={onClick ?? undefined}/>
    );
}
