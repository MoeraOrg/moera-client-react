import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import deepEqual from 'react-fast-compare';

import { ClientState } from "state/state";
import { useThrottle } from "ui/hook";

interface Props<Text, Values> {
    toText: (values: Values) => Text | null;
    isChanged: (text: Text) => boolean;
    save: (text: Text, values: Values) => void;
    drop: () => void;
    savingDraftSelector: (state: ClientState) => boolean;
    savedDraftSelector: (state: ClientState) => boolean;
}

export interface DraftSavingState {
    unsaved: boolean;
    saving: boolean;
    saved: boolean;
}

export function useDraftSaver<Text, Values>({
    toText, isChanged, save, drop, savingDraftSelector, savedDraftSelector
}: Props<Text, Values>): DraftSavingState {
    const savingDraft = useSelector(savingDraftSelector);
    const savedDraft = useSelector(savedDraftSelector);

    const {status, values, initialValues} = useFormikContext<Values>();
    const [savedValues, setSavedValues] = useState<Values>(initialValues);
    const unsavedValues = useThrottle(values, 1500, 5000);
    const savingValues = useRef<Values | null>(null);

    useEffect(() => setSavedValues(initialValues), [initialValues]);

    useEffect(() => {
        if (savingDraft) {
            return;
        }
        if (status === "submitted" || deepEqual(unsavedValues, savedValues)) {
            setSavedValues(unsavedValues);
            return;
        }
        const thisText = toText(unsavedValues);
        if (thisText == null) {
            setSavedValues(unsavedValues);
            return;
        }
        if (isChanged(thisText)) {
            save(thisText, unsavedValues);
        } else {
            drop();
        }
        savingValues.current = unsavedValues;
    }, [drop, isChanged, save, savedValues, savingDraft, status, toText, unsavedValues]);

    useEffect(() => {
        if (savedDraft && !savingDraft && savingValues.current != null) {
            setSavedValues(savingValues.current);
        }
    }, [savedDraft, savingDraft]);

    const unsavedChanges = useMemo(() => !deepEqual(values, savedValues), [savedValues, values]);

    return {
        unsaved: unsavedChanges,
        saving: savingDraft,
        saved: savedDraft
    };
}
