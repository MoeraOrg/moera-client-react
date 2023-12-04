import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { Loading } from "ui/control";
import ProfileView from "ui/profile/view/ProfileView";

const ProfileEditor = React.lazy(() => import("ui/profile/edit/ProfileEditor"));

export default function ProfilePage() {
    const editing = useSelector((state: ClientState) => state.profile.editing);
    return (
        <>
            {!editing && <ProfileView/>}
            {editing &&
                <Suspense fallback={<Loading/>}>
                    <ProfileEditor/>
                </Suspense>
            }
        </>
    );
}
