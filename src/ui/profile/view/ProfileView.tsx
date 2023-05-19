import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { profileEdit } from "state/profile/actions";
import { isProfileEditable } from "state/profile/selectors";
import { getOwnerCard, getOwnerName } from "state/node/selectors";
import { Avatar, Button, DonateButton, Loading } from "ui/control";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import PageShareButton from "ui/page/PageShareButton";
import NodeNameView from "ui/profile/view/NodeNameView";
import EntryHtml from "ui/entry/EntryHtml";
import { shortGender } from "util/misc";
import "./ProfileView.css";

type EditButtonProps = ConnectedProps<typeof editButtonConnector>;

const EditButtonImpl = ({profileEdit}: EditButtonProps) => {
    const {t} = useTranslation();

    return (
        <Button variant="outline-primary" size="sm" style={{marginLeft: "1rem"}} onClick={profileEdit}>
            {t("edit")}
        </Button>
    );
}

const editButtonConnector = connect(
    null,
    {profileEdit}
);

const EditButton = editButtonConnector(EditButtonImpl);

type ProfileViewProps = ConnectedProps<typeof profileViewConnector>;

const ProfileView = ({loading, profile, ownerName, editable}: ProfileViewProps) => {
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>
                    {t("profile")}
                    {" "}<FeedSubscribeButton feedName="timeline"/>
                    {" "}{editable && <EditButton/>}
                    <PageShareButton href="/profile"/>
                </h2>
            </PageHeader>
            <Page>
                <div className="profile-view content-panel">
                    <Avatar avatar={profile?.avatar} ownerName={ownerName} size={200}/>
                    <Loading active={loading}/>
                    <div className="full-name">
                        {profile?.fullName ?? NodeName.shorten(ownerName)}
                        {profile?.gender && <span className="gender">{shortGender(profile.gender, t)}</span>}
                    </div>
                    <NodeNameView/>
                    {profile?.title && <div className="title">{profile.title}</div>}
                    <DonateButton name={ownerName} fullName={profile?.fullName ?? null}
                                  fundraisers={profile?.fundraisers ?? null} className="donate"/>
                    {profile?.email &&
                        <div className="email">
                            <span className="title">{t("e-mail")}:</span>{" "}
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </div>
                    }
                    {profile?.bioHtml && <EntryHtml className="bio" html={profile.bioHtml} nodeName={ownerName}/>}
                </div>
            </Page>
        </>
    );
}

const profileViewConnector = connect(
    (state: ClientState) => {
        const details = getOwnerCard(state)?.details;
        return ({
            loading: details?.loading ?? true,
            profile: details?.profile,
            ownerName: getOwnerName(state),
            editable: isProfileEditable(state)
        });
    }
);

export default profileViewConnector(ProfileView);
