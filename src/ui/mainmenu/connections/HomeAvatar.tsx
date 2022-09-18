import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { Avatar } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./HomeAvatar.css";

type Props = ConnectedProps<typeof connector>;

const HomeAvatar = ({ownerName, avatar}: Props) => {
    const {t} = useTranslation();

    return (
        <Jump nodeName=":" href="/profile" title={t("your-profile")}>
            <Avatar avatar={avatar} ownerName={ownerName} size={32} nodeName=":" className="home-avatar"/>
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getHomeOwnerName(state),
        avatar: getHomeOwnerAvatar(state)
    })
);

export default connector(HomeAvatar);
