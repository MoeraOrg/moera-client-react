import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { peopleGoToTab } from "state/people/actions";
import { PeopleTab } from "state/people/state";
import PeopleTabsItem from "ui/people/PeopleTabsItem";
import "./PeopleTabs.css";

type PeopleTabsProps = {
    active: PeopleTab;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({active, loadedGeneral, subscribersTotal, subscriptionsTotal, viewSubscribers, viewSubscriptions,
                     peopleGoToTab}: PeopleTabsProps) => {
    const {t} = useTranslation();

    return (
        <div className="people-tabs">
            {subscribersTotal != null &&
                <PeopleTabsItem name="subscribers" title={t("subscribers")} principal={viewSubscribers}
                                total={subscribersTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {subscriptionsTotal != null &&
                <PeopleTabsItem name="subscriptions" title={t("subscriptions")} principal={viewSubscriptions}
                                total={subscriptionsTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            <div className="rest"/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal,
        viewSubscribers: state.people.operations.viewSubscribers ?? "public",
        viewSubscriptions: state.people.operations.viewSubscriptions ?? "public"
    }),
    { peopleGoToTab }
);

export default connector(PeopleTabs);
