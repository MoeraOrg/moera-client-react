import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { Button, Loading, LoadingInline } from "ui/control";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import { useButtonPopper } from "ui/hook";
import ComposeDraftItem from "ui/compose/ComposeDraftItem";
import ComposeNewPost from "ui/compose/ComposeNewPost";
import "./ComposeDraftSelector.css";

function ComposeDraftSelector({postingId, draftId, draftList, loadingDraftList, loadedDraftList, composeDraftSelect,
                               composeDraftListItemDelete}) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-start");

    const onSelect = useCallback(id => {
        if (id !== draftId) {
            composeDraftSelect(id);
        }
   }, [draftId, composeDraftSelect]);

    const onDelete = useCallback(id => {
        composeDraftListItemDelete(id);
    }, [composeDraftListItemDelete]);

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

export default connect(
    state => ({
        postingId: state.compose.postingId,
        draftId: state.compose.draftId,
        draftList: state.compose.draftList,
        loadingDraftList: state.compose.loadingDraftList,
        loadedDraftList: state.compose.loadedDraftList,
        pulse: state.pulse.pulse // To force re-rendering only
    }),
    { composeDraftSelect, composeDraftListItemDelete }
)(ComposeDraftSelector);
