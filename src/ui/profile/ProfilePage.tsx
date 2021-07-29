import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import ProfileView from "ui/profile/view/ProfileView";
import ProfileEditor from "ui/profile/edit/ProfileEditor";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const ProfilePage = ({editing}: Props) => (
    <>
        {!editing && <ProfileView/>}
        {editing && <ProfileEditor/>}
    </>
);

const connector = connect(
    (state: ClientState) => ({
        editing: state.profile.editing
    })
);

export default connector(ProfilePage);
