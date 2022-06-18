import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { peopleGoToTab } from "state/people/actions";
import { PeopleTab } from "state/people/state";
import { isSubscribersVisible, isSubscriptionsVisible } from "state/people/selectors";
import "./PeopleTabs.css";

interface TabProps {
    name: PeopleTab;
    title: string;
    total: number;
    loaded: boolean;
    active: string;
    peopleGoToTab: (tab: PeopleTab) => void;
}

const Tab = ({name, title, total, loaded, active, peopleGoToTab}: TabProps) => (
    <div className={cx("tab", {"active": name === active})} onClick={() => peopleGoToTab(name)}>
        {title}{loaded ? ` (${total})` : ""}
    </div>
);

type PeopleTabsProps = {
    active: PeopleTab;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({active, loadedGeneral, subscribersTotal, subscriptionsTotal, subscribersVisible,
                     subscriptionsVisible, peopleGoToTab}: PeopleTabsProps) => (
    <div className="people-tabs">
        {subscribersVisible &&
            <Tab name="subscribers" title="Subscribers" total={subscribersTotal} loaded={loadedGeneral}
                 active={active} peopleGoToTab={peopleGoToTab}/>
        }
        {subscriptionsVisible &&
            <Tab name="subscriptions" title="Subscriptions" total={subscriptionsTotal} loaded={loadedGeneral}
                 active={active} peopleGoToTab={peopleGoToTab}/>
        }
        <div className="rest"/>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal,
        subscribersVisible: isSubscribersVisible(state),
        subscriptionsVisible: isSubscriptionsVisible(state)
    }),
    { peopleGoToTab }
);

export default connector(PeopleTabs);
