import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { peopleGoToTab } from "state/people/actions";
import "./PeopleTabs.css";

const Tab = ({name, title, active, peopleGoToTab}) => (
    <div className={cx("tab", {"active": name === active})} onClick={() => peopleGoToTab(name)}>{title}</div>
);

const PeopleTabs = ({active, peopleGoToTab}) => (
    <div className="people-tabs">
        <Tab name="subscribers" title="Subscribers" active={active} peopleGoToTab={peopleGoToTab}/>
        <Tab name="subscriptions" title="Subscriptions" active={active} peopleGoToTab={peopleGoToTab}/>
        <div className="rest"/>
    </div>
);

export default connect(
    null,
    { peopleGoToTab }
)(PeopleTabs);
