import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { Avatar } from "ui/control";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";

export default function HomeAvatar() {
    const ownerName = useSelector(getHomeOwnerName);
    const avatar = useSelector(getHomeOwnerAvatar);
    const {t} = useTranslation();

    return (
        <Jump nodeName={REL_HOME} href="/" title={t("your-posts")}>
            <Avatar avatar={avatar} ownerName={ownerName} size={32} nodeName={REL_HOME} className="home-avatar"/>
        </Jump>
    );
}
