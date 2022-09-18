import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { Button, NameSelector } from "ui/control";
import { ClientState } from "state/state";
import { ownerSwitch, ownerSwitchClose } from "state/node/actions";
import { NameListItem } from "util/names-list";
import "./OwnerNavigator.css";

type Props = ConnectedProps<typeof connector>;

function OwnerNavigator({ownerName, switching, ownerSwitch, ownerSwitchClose}: Props) {
    const [query, setQuery] = useState<string>("");
    const {t} = useTranslation();

    const onChange = (query: string | null) => {
        if (query != null) {
            setQuery(query);
        }
    }

    const onSubmit = (success: boolean, {nodeName}: NameListItem) => {
        if (success && nodeName) {
            ownerSwitch(nodeName);
        } else {
            ownerSwitchClose();
        }
    }

    const onButtonClick = () => {
        onSubmit(true, {nodeName: query});
    }

    return (
        <div id="owner-navigator">
            <NameSelector defaultQuery={NodeName.shorten(ownerName) ?? undefined} onChange={onChange}
                          onSubmit={onSubmit}/>
            <Button variant="secondary" size="sm" loading={switching} onClick={onButtonClick}>{t("go")}</Button>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: state.node.owner.name,
        switching: state.node.owner.switching
    }),
    { ownerSwitch, ownerSwitchClose }
);

export default connector(OwnerNavigator);
