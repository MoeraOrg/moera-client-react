import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTranslation } from 'react-i18next';

import "./PeopleIconSet.css";

interface PeopleIcon {
    icon: IconProp;
    title: string;
    gender?: string | null;
    visible: boolean;
}

interface Props {
    icons: PeopleIcon[];
}

export default function PeopleIconSet({icons}: Props) {
    const {t} = useTranslation();

    return (
        <>
            {icons.map((icon, index) =>
                icon.visible &&
                    <span className="icon" title={t(icon.title, {gender: icon.gender})} key={index}>
                        <FontAwesomeIcon icon={icon.icon}/>
                    </span>
            )}
        </>
    );
}
