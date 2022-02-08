import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { NodeName } from "api";
import { profileEdit } from "state/profile/actions";
import { isProfileEditable } from "state/profile/selectors";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
import { Avatar, Button, DonateButton, Loading } from "ui/control";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import PageShareButton from "ui/page/PageShareButton";
import NodeNameView from "ui/profile/view/NodeNameView";
import { shortGender } from "util/misc";
import "./ProfileView.css";

type EditButtonProps = ConnectedProps<typeof editButtonConnector>;

const EditButtonImpl = ({profileEdit}: EditButtonProps) => (
    <Button variant="outline-primary" size="sm" style={{marginLeft: "1rem"}} onClick={profileEdit}>
        Edit
    </Button>
);

const editButtonConnector = connect(
    null,
    {profileEdit}
);

const EditButton = editButtonConnector(EditButtonImpl);

type ProfileViewProps = ConnectedProps<typeof profileViewConnector>;

const ProfileView = ({loading, profile: {fullName, gender, email, title, bioHtml, avatar, fundraisers}, ownerName,
                      editable}: ProfileViewProps) => (
    <>
        <PageHeader>
            <h2>
                Profile
                {" "}<FeedSubscribeButton feedName="timeline"/>
                {" "}{editable && <EditButton/>}
            </h2>
            <div className="page-header-buttons">
                <PageShareButton href="/profile"/>
            </div>
        </PageHeader>
        <Page>
            <div className="profile-view">
                <Avatar avatar={avatar} ownerName={ownerName} size={200}/>
                <Loading active={loading}/>
                <div className="full-name">
                    {fullName ? fullName : NodeName.shorten(ownerName)}
                    {gender && <span className="gender">{shortGender(gender)}</span>}
                </div>
                <NodeNameView/>
                {title && <div className="title">{title}</div>}
                <DonateButton name={ownerName} fullName={fullName ?? null} fundraisers={fundraisers ?? null}
                              className="donate"/>
                {email &&
                    <div className="email">
                        <span className="title">E-mail:</span> <a href={`mailto:${email}`}>{email}</a>
                    </div>
                }
                {bioHtml && <div className="bio" dangerouslySetInnerHTML={{__html: bioHtml}}/>}
            </div>
        </Page>
    </>
);

const profileViewConnector = connect(
    (state: ClientState) => ({
        loading: state.profile.loading,
        profile: state.profile.profile,
        ownerName: getOwnerName(state),
        editable: isProfileEditable(state)
    })
);

export default profileViewConnector(ProfileView);
