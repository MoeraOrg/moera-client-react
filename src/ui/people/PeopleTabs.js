import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { peopleGoToTab } from "state/people/actions";
import "./PeopleTabs.css";

const Tab = ({name, title, total, loaded, active, peopleGoToTab}) => (
    <div className={cx("tab", {"active": name === active})} onClick={() => peopleGoToTab(name)}>
        {title}{loaded ? ` (${total})` : ""}
    </div>
);

const PeopleTabs = ({active, loadedGeneral, subscribersTotal, subscriptionsTotal, peopleGoToTab}) => (
    <div className="people-tabs">
        <Tab name="subscribers" title="Subscribers" total={subscribersTotal} loaded={loadedGeneral} active={active}
             peopleGoToTab={peopleGoToTab}/>
        <Tab name="subscriptions" title="Subscriptions" total={subscriptionsTotal} loaded={loadedGeneral} active={active}
             peopleGoToTab={peopleGoToTab}/>
        <div className="rest"/>
    </div>
);

export default connect(
    state => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal
    }),
    { peopleGoToTab }
)(PeopleTabs);
