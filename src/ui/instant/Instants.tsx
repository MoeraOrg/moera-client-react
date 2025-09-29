import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import { feedPastSliceLoad } from "state/feeds/actions";
import { useParent } from "ui/hook";
import InstantStory from "ui/instant/InstantStory";
import InstantsSentinel from "ui/instant/InstantsSentinel";
import NoInstants from "ui/instant/NoInstants";
import { REL_HOME } from "util/rel-node-name";
import "./Instants.css";

interface Props {
    instantBorder: number;
}

export default function Instants({instantBorder}: Props) {
    const loadingPast = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").loadingPast);
    const after = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").after);
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const pastIntersecting = useRef<boolean>(true);

    const {hide} = useParent();

    const loadPast = () => {
        if (loadingPast || after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        dispatch(feedPastSliceLoad(REL_HOME, "instant"));
    }

    const onSentinelPast = (intersecting: boolean) => {
        pastIntersecting.current = intersecting;
        if (pastIntersecting.current) {
            loadPast();
        }
    }

    return (
        <>
            {stories.length === 0 && after <= Number.MIN_SAFE_INTEGER ?
                <NoInstants/>
            :
                stories.map(story =>
                    <React.Fragment key={story.moment}>
                        <InstantStory story={story} hide={hide}/>
                        {story.moment === instantBorder && <hr/>}
                    </React.Fragment>
                )
            }
            <InstantsSentinel
                loading={loadingPast}
                title={t("load-more")}
                margin="0px 0px 100px 0px"
                visible={after > Number.MIN_SAFE_INTEGER}
                onSentinel={onSentinelPast}
                onClick={loadPast}
            />
        </>
    );
}
