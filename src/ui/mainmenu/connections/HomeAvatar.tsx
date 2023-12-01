import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { Avatar } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./HomeAvatar.css";

export default function HomeAvatar() {
    const ownerName = useSelector(getHomeOwnerName);
    const avatar = useSelector(getHomeOwnerAvatar);
    const {t} = useTranslation();

    return (
        <Jump nodeName=":" href="/profile" title={t("your-profile")}>
            <Avatar avatar={avatar} ownerName={ownerName} size={32} nodeName=":" className="home-avatar"/>
        </Jump>
    );
}
