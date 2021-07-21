import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import { Button, Loading, LoadingInline } from "ui/control";
import { useButtonPopper } from "ui/hook";
import ComposeDraftItem from "ui/compose/ComposeDraftItem";
import ComposeNewPost from "ui/compose/ComposeNewPost";
import "./ComposeDraftSelector.css";

type Props = ConnectedProps<typeof connector>;

function ComposeDraftSelector({postingId, draftId, draftList, loadingDraftList, loadedDraftList, composeDraftSelect,
                               composeDraftListItemDelete}: Props) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-start");

    const onSelect = (id: string) => {
        if (id !== draftId) {
            composeDraftSelect(id);
        }
   };

    const onDelete = (id: string) => composeDraftListItemDelete(id);

    if (postingId != null) {
        return null;
    }
    if (!loadedDraftList) {
        return <Loading active={loadingDraftList}/>;
    }
    if (draftList.length === 0) {
        return null;
    }

    return (
        <div ref={setButtonRef} className="draft-selector btn-group dropdown">
            <Button variant="info" className="dropdown-toggle" onClick={onToggle}>
                Drafts{" "}
                {loadingDraftList ?
                    <LoadingInline active={loadingDraftList}/>
                :
                    <span className="badge badge-light">{draftList.length}</span>
                }
            </Button>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade popover shadow-sm show">
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

const connector = connect(
    (state: ClientState) => ({
        postingId: state.compose.postingId,
        draftId: state.compose.draftId,
        draftList: state.compose.draftList,
        loadingDraftList: state.compose.loadingDraftList,
        loadedDraftList: state.compose.loadedDraftList,
        pulse: state.pulse.pulse // To force re-rendering only
    }),
    { composeDraftSelect, composeDraftListItemDelete }
);

export default connector(ComposeDraftSelector);
