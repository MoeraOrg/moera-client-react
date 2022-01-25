import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { Avatar } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./HomeAvatar.css";

type Props = ConnectedProps<typeof connector>;

const HomeAvatar = ({ownerName, avatar}: Props) => (
    <Jump nodeName=":" href="/profile" title="Your profile">
        <Avatar avatar={avatar} ownerName={ownerName} size={32} nodeName=":" className="home-avatar"/>
    </Jump>
);

const connector = connect(
    (state: ClientState) => ({
        ownerName: state.home.owner.name,
        avatar: state.home.owner.avatar
    })
);

export default connector(HomeAvatar);
