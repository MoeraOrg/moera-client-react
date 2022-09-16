import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import deepEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';

import "./DraftSaver.css";

interface DraftSaverProps<Text, Values> {
    initialized?: boolean;
    initialText: Text;
    savingDraft: boolean;
    savedDraft: boolean;
    toText: (values: Values) => Text | null;
    isChanged: (text: Text) => boolean;
    save: (text: Text, values: Values) => void;
    drop: () => void;
}

export function DraftSaver<Text, Values>(props: DraftSaverProps<Text, Values>) {
    const {initialized = true, initialText, savingDraft, savedDraft, toText, isChanged, save, drop} = props;

    const [, setPrevText] = useState<Text>(initialText);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
    const {status, values} = useFormikContext<Values>();
    const {t} = useTranslation();

    const initializedRef = useRef<boolean>();
    initializedRef.current = initialized;
    const statusRef = useRef<string>();
    statusRef.current = status;
    const valuesRef = useRef<Values>();
    valuesRef.current = values;
    const savingDraftRef = useRef<boolean>();
    savingDraftRef.current = savingDraft;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSave = useCallback(
        debounce(() => {
            if (!initializedRef.current || statusRef.current === "submitted" || valuesRef.current == null) {
                return;
            }
            const thisText = toText(valuesRef.current);
            if (thisText == null || savingDraftRef.current) {
                return;
            }
            if (isChanged(thisText)) {
                save(thisText, valuesRef.current);
            } else {
                drop();
            }
            setUnsavedChanges(false);
        }, 1500, {maxWait: 10000}),
    [statusRef, valuesRef, savingDraftRef, toText, isChanged, save, drop, setUnsavedChanges]);

    useEffect(() => {
        return () => {
            onSave.cancel();
        }
    }, [onSave]);

    useEffect(() => {
        setPrevText(prevText => {
            const thisText = toText(values);
            if (thisText == null) {
                return prevText;
            }
            if (!deepEqual(prevText, thisText)) {
                setUnsavedChanges(true);
                onSave();
            }
            return thisText;
        });
    }, [values, props, setPrevText, initialText, setUnsavedChanges, onSave, toText]);

    return (
        <div className="draft-saver">
            {!unsavedChanges && savingDraft && t("draft-saving")}
            {!unsavedChanges && savedDraft && t("draft-saved")}
        </div>
    );
}
