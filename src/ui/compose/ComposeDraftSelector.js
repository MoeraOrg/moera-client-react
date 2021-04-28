import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { usePopper } from 'react-popper';

import { Button, Loading, LoadingInline } from "ui/control";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import ComposeDraftItem from "ui/compose/ComposeDraftItem";
import ComposeNewPost from "ui/compose/ComposeNewPost";
import "./ComposeDraftSelector.css";

function ComposeDraftSelector({postingId, draftId, draftList, loadingDraftList, loadedDraftList, composeDraftSelect,
                               composeDraftListItemDelete}) {
    const [visible, setVisible] = useState(false);

    const onToggle = useCallback(() => setVisible(visible => !visible), [setVisible]);
    const onHide = useCallback(() => setVisible(false), [setVisible]);
    useEffect(() => {
        if (visible) {
            document.getElementById("app-root").addEventListener("click", onHide);
            return () => {
                document.getElementById("app-root").removeEventListener("click", onHide);
            }
        }
    }, [visible, onHide])

    const onSelect = useCallback(id => {
        if (id !== draftId) {
            composeDraftSelect(id);
        }
   }, [draftId, composeDraftSelect]);

    const onDelete = useCallback(id => {
        composeDraftListItemDelete(id);
    }, [composeDraftListItemDelete]);

    const [buttonRef, setButtonRef] = useState(null);
    const [popperRef, setPopperRef] = useState(null);
    const {styles: popperStyles, attributes: popperAttributes} =
        usePopper(buttonRef, popperRef, {placement: "bottom-start"});

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
                <div ref={setPopperRef} style={popperStyles.popper} {...popperAttributes.popper}
                     className="fade dropdown-menu shadow-sm show">
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
