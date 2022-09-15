import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    error: string | null | undefined;
}

export default function FieldError({error}: Props) {
    const {t} = useTranslation();

    if (error == null) {
        return null;
    }

    return <div className="invalid-feedback">{t(error)}</div>
}
