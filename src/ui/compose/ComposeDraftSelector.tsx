import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import { isComposeReady } from "state/compose/selectors";
import { Button, Loading, LoadingInline } from "ui/control";
import { useButtonPopper } from "ui/hook";
import ComposeDraftItem from "ui/compose/ComposeDraftItem";
import ComposeNewPost from "ui/compose/ComposeNewPost";
import "./ComposeDraftSelector.css";

export default function ComposeDraftSelector() {
    const ready = useSelector(isComposeReady);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const draftList = useSelector((state: ClientState) => state.compose.draftList);
    const loadingDraftList = useSelector((state: ClientState) => state.compose.loadingDraftList);
    const loadedDraftList = useSelector((state: ClientState) => state.compose.loadedDraftList);
    useSelector((state: ClientState) => state.pulse.pulse); // To force re-rendering only
    const dispatch = useDispatch();

    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex
    } = useButtonPopper("bottom-start");

    const {t} = useTranslation();

    const onSelect = (id: string) => {
        if (id !== draftId) {
            dispatch(composeDraftSelect(id));
        }
   };

    const onDelete = (id: string) => dispatch(composeDraftListItemDelete(id, true));

    if (postingId != null) {
        return null;
    }
    if (!loadedDraftList) {
        return loadingDraftList ? <Loading/> : null;
    }
    if (draftList.length === 0) {
        return null;
    }

    return (
        <div ref={setButtonRef} className="draft-selector btn-group">
            <Button variant="info" className="dropdown-toggle" disabled={!ready} onClick={onToggle}>
                {t("Drafts") + " "}
                {loadingDraftList ?
                    <LoadingInline/>
                :
                    <span className="badge bg-light text-dark">{draftList.length}</span>
                }
            </Button>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className="fade dropdown-menu popover shadow-sm show">
                    <ComposeNewPost/>
                    {draftList.map(draft =>
                        <ComposeDraftItem key={draft.id} draft={draft} current={draftId === draft.id}
                                          onSelect={onSelect} onDelete={onDelete}/>
                    )}
                </div>
            }
        </div>
    );
}
