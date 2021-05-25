import React from 'react';
import { connect } from 'react-redux';

import ProfileView from "ui/profile/view/ProfileView";
import ProfileEditor from "ui/profile/edit/ProfileEditor";

const ProfilePage = ({editing}) => (
    <>
        {!editing && <ProfileView/>}
        {editing && <ProfileEditor/>}
    </>
);

export default connect(
    state => ({
        editing: state.profile.editing
    })
)(ProfilePage);
