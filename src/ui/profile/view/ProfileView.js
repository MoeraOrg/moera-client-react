import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import PageHeader from "ui/page/PageHeader";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import { Page } from "ui/page/Page";
import NodeNameView from "ui/profile/view/NodeNameView";
import { profileEdit } from "state/profile/actions";
import { isProfileEditable } from "state/profile/selectors";
import { getOwnerName } from "state/owner/selectors";
import "./ProfileView.css";

const EditButtonImpl = ({profileEdit}) => (
    <Button variant="outline-primary" size="sm" style={{marginLeft: "1rem"}} onClick={profileEdit}>
        Edit
    </Button>
);

const EditButton = connect(
    null,
    {profileEdit}
)(EditButtonImpl);

const ProfileView = ({loading, fullName, gender, email, title, bioHtml, ownerName, editable}) => (
    <>
        <PageHeader>
            <h2>Profile <FeedSubscribeButton feedName="timeline"/></h2>
        </PageHeader>
        <Page>
            <div className="profile-view">
                <NodeNameView />
                <br />
                <br />
                <h4>
                    Details <Loading active={loading}/>
                    {editable && <EditButton/>}
                </h4>
                <div className="full-name">
                    {fullName ? fullName : ownerName}{gender && <span className="gender">({gender})</span>}
                </div>
                {title && <div className="title">{title}</div>}
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

ProfileView.propTypes = {
    loading: PropType.bool,
    fullName: PropType.string,
    gender: PropType.string,
    email: PropType.string,
    title: PropType.string,
    bioHtml: PropType.string,
    ownerName: PropType.string,
    editable: PropType.bool
};

export default connect(
    state => ({
        ...state.profile,
        ownerName: getOwnerName(state),
        editable: isProfileEditable(state)
    })
)(ProfileView);
