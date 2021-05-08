import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';

import { getOwnerAvatar } from "state/owner/selectors";
import PageHeader from "ui/page/PageHeader";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import FeedGotoButton from "ui/feed/FeedGotoButton";
import FeedTopButton from "ui/feed/FeedTopButton";
import { Avatar } from "ui/control";
import { getPageHeaderHeight } from "util/misc";

function FeedPageHeader({feedName, title, empty, atTop, atBottom, avatar}) {
    const [avatarVisible, setAvatarVisible] = useState(false);

    const onScroll = useCallback(
        () => setAvatarVisible(window.scrollY >= getPageHeaderHeight()),
        [setAvatarVisible]
    );

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [onScroll]);

    return (
        <PageHeader>
            <h2>
                {avatarVisible &&
                    <Avatar avatar={avatar} size={40}/>
                }
                {title}
                <FeedSubscribeButton feedName={feedName}/>
            </h2>
            {!empty &&
                <FeedGotoButton feedName={feedName} atBottom={atBottom}/>
            }
            <FeedTopButton feedName={feedName} atTop={atTop}/>
        </PageHeader>
    );
}

FeedPageHeader.propTypes = {
    feedName: PropType.string,
    title: PropType.string,
    empty: PropType.bool,
    atTop: PropType.bool,
    atBottom: PropType.bool
};

export default connect(
    state => ({
        avatar: getOwnerAvatar(state)
    })
)(FeedPageHeader);
