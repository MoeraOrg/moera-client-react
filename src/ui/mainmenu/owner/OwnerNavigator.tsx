import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { ownerSwitch, ownerSwitchClose } from "state/node/actions";
import { Button, NameSelector } from "ui/control";
import { NameListItem } from "util/names-list";
import "./OwnerNavigator.css";

export default function OwnerNavigator() {
    const switching = useSelector((state: ClientState) => state.node.owner.switching);
    const dispatch = useDispatch();

    const [query, setQuery] = useState<string>("");
    const {t} = useTranslation();

    const onChange = (query: string | null) => {
        if (query != null) {
            setQuery(query);
        }
    }

    const onSubmit = (success: boolean, {nodeName}: NameListItem) => {
        if (success && nodeName) {
            dispatch(ownerSwitch(nodeName));
        } else {
            dispatch(ownerSwitchClose());
        }
    }

    const onButtonClick = () => {
        onSubmit(true, {nodeName: query});
    }

    return (
        <div id="owner-navigator">
            <NameSelector onChange={onChange} onSubmit={onSubmit}/>
            <Button variant="secondary" size="sm" loading={switching} onClick={onButtonClick}>{t("go")}</Button>
        </div>
    );
}
