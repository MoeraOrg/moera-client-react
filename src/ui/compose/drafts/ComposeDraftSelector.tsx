import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import { isComposeReady } from "state/compose/selectors";
import { useButtonPopper } from "ui/hook";
import { Button, Loading, LoadingInline } from "ui/control";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import ComposeDraftItem from "ui/compose/drafts/ComposeDraftItem";
import ComposeNewPost from "ui/compose/drafts/ComposeNewPost";
import "./ComposeDraftSelector.css";

export default function ComposeDraftSelector() {
    const ready = useSelector(isComposeReady);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const draftList = useSelector((state: ClientState) => state.compose.draftList);
    const loadingDraftList = useSelector((state: ClientState) => state.compose.loadingDraftList);
    const loadedDraftList = useSelector((state: ClientState) => state.compose.loadedDraftList);
    useSelector((state: ClientState) => state.pulse.pulse); // To force re-rendering only
    const {focus} = useRichTextEditorCommands();
    const dispatch = useDispatch();

    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, zIndex
    } = useButtonPopper("bottom-start");

    const {t} = useTranslation();

    const onSelect = (id: string) => {
        if (id !== draftId) {
            dispatch(composeDraftSelect(id));
        }
        focus();
   };

    const onDelete = (id: string) => {
        dispatch(composeDraftListItemDelete(id, true));
        focus();
    }

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
        <div ref={setButtonRef} className={cx("draft-selector", {"dropup": visible})}>
            <Button variant="tool" className="dropdown-toggle" active={visible} disabled={!ready} onClick={onToggle}>
                {t("Drafts") + " "}
                {loadingDraftList ?
                    <LoadingInline/>
                :
                    <span className="count">({draftList.length})</span>
                }
            </Button>
            {visible &&
                <div
                    ref={setPopperRef}
                    style={{...popperStyles, zIndex: zIndex?.widget}}
                    className="fade dropdown-menu border-primary-600 shadow-sm show"
                >
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
