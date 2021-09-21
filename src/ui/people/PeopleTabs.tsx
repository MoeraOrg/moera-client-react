import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { peopleGoToTab } from "state/people/actions";
import "./PeopleTabs.css";

interface TabProps {
    name: string;
    title: string;
    total: number;
    loaded: boolean;
    active: string;
    peopleGoToTab: (tab: string) => void;
}

const Tab = ({name, title, total, loaded, active, peopleGoToTab}: TabProps) => (
    <div className={cx("tab", {"active": name === active})} onClick={() => peopleGoToTab(name)}>
        {title}{loaded ? ` (${total})` : ""}
    </div>
);

type PeopleTabsProps = {
    active: string;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({active, loadedGeneral, subscribersTotal, subscriptionsTotal, peopleGoToTab}: PeopleTabsProps) => (
    <div className="people-tabs">
        <Tab name="subscribers" title="Subscribers" total={subscribersTotal} loaded={loadedGeneral} active={active}
             peopleGoToTab={peopleGoToTab}/>
        <Tab name="subscriptions" title="Subscriptions" total={subscriptionsTotal} loaded={loadedGeneral} active={active}
             peopleGoToTab={peopleGoToTab}/>
        <div className="rest"/>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal
    }),
    { peopleGoToTab }
);

export default connector(PeopleTabs);