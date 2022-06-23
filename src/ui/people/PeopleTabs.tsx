import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSettingNode } from "state/settings/selectors";
import { peopleGoToTab } from "state/people/actions";
import { PeopleTab } from "state/people/state";
import PeopleTabsItem from "ui/people/PeopleTabsItem";
import "./PeopleTabs.css";

type PeopleTabsProps = {
    active: PeopleTab;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({active, loadedGeneral, subscribersTotal, subscriptionsTotal, viewSubscribers, viewSubscriptions,
                     peopleGoToTab}: PeopleTabsProps) => (
    <div className="people-tabs">
        {subscribersTotal != null &&
            <PeopleTabsItem name="subscribers" title="Subscribers" principal={viewSubscribers}
                            total={subscribersTotal} loaded={loadedGeneral} active={active}
                            peopleGoToTab={peopleGoToTab}/>
        }
        {subscriptionsTotal != null &&
            <PeopleTabsItem name="subscriptions" title="Subscriptions" principal={viewSubscriptions}
                            total={subscriptionsTotal} loaded={loadedGeneral} active={active}
                            peopleGoToTab={peopleGoToTab}/>
        }
        <div className="rest"/>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal,
        viewSubscribers: getSettingNode(state, "subscribers.view") as PrincipalValue,
        viewSubscriptions: getSettingNode(state, "subscriptions.view") as PrincipalValue
    }),
    { peopleGoToTab }
);

export default connector(PeopleTabs);
