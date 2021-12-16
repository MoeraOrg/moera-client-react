import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import deepEqual from 'react-fast-compare';
import "./DraftSaver.css";

interface Logic<Text, Values, OuterProps> {
    toText: (values: Values, props: OuterProps) => Text | null;
    isEmpty: (text: Text) => boolean;
    save: (text: Text, values: Values, props: OuterProps) => void;
}

interface LogicProp<Text, Values, OuterProps> {
    logic: Logic<Text, Values, OuterProps>;
}

interface DraftSaverProps<Text> {
    initialText: Text;
    savingDraft: boolean;
    savedDraft: boolean;
}

export function DraftSaver<Text, Values, OuterProps extends DraftSaverProps<Text>>
                          (props: OuterProps & LogicProp<Text, Values, OuterProps>) {
    const {logic, initialText, savingDraft, savedDraft} = props;

    const [, setPrevText] = useState<Text>(initialText);
    const [dirty, setDirty] = useState<boolean>(false);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
    const {status, values} = useFormikContext<Values>();

    useEffect(
        () => setDirty(false),
        [initialText]
    );

    const statusRef = useRef<string>();
    statusRef.current = status;
    const valuesRef = useRef<Values>();
    valuesRef.current = values;
    const dirtyRef = useRef<boolean>();
    dirtyRef.current = dirty;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSave = useCallback(debounce(() => {
        if (statusRef.current === "submitted" || valuesRef.current == null) {
            return;
        }
        const thisText = logic.toText(valuesRef.current, props);
        if (thisText == null || (logic.isEmpty(thisText) && !dirtyRef.current) || savingDraft) {
            return;
        }
        setDirty(true);
        logic.save(thisText, valuesRef.current, props);
        setUnsavedChanges(false);
    }, 1500, {maxWait: 10000}), [statusRef, valuesRef, dirtyRef, props, setUnsavedChanges]);

    useEffect(() => {
        return () => {
            onSave.cancel();
        }
    }, [onSave]);

    useEffect(() => {
        setPrevText(prevText => {
            const thisText = logic.toText(values, props);
            if (thisText == null) {
                return prevText;
            }
            if (!deepEqual(prevText, thisText) && (!deepEqual(initialText, thisText) || dirty)) {
                setUnsavedChanges(true);
                if (!logic.isEmpty(thisText) || dirty) {
                    onSave();
                }
            }
            return thisText;
        });
    }, [values, dirty, props, setPrevText, initialText, setUnsavedChanges, onSave, logic]);

    return (
        <div className="draft-saver">
            {!unsavedChanges && savingDraft && "Saving..."}
            {!unsavedChanges && savedDraft && "Draft saved."}
        </div>
    );
}
