import React, { Suspense } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import ProfileView from "ui/profile/view/ProfileView";

const ProfileEditor = React.lazy(() => import("ui/profile/edit/ProfileEditor"));

type Props = ConnectedProps<typeof connector>;

const ProfilePage = ({editing}: Props) => (
    <>
        {!editing && <ProfileView/>}
        {editing &&
            <Suspense fallback={null}>
                <ProfileEditor/>
            </Suspense>
        }
    </>
);

const connector = connect(
    (state: ClientState) => ({
        editing: state.profile.editing
    })
);

export default connector(ProfilePage);
