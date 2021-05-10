import { useCallback, useEffect, useRef, useState } from 'react';
import { useField } from 'formik';

export default function useComposeTextEditable(name, postingId, draftId) {
    const [field, {value, initialValue}, {setValue}] = useField(name);
    const [edit, setEdit] = useState(false);

    const onEdit = useCallback(() => setEdit(true), [setEdit]);

    const onReset = useCallback(() => {
        setValue(initialValue);
        setEdit(false);
    }, [initialValue, setValue, setEdit]);

    const onKeyDown = useCallback(event => {
        if (event.key === "Escape" && onReset) {
            onReset();
        }
    }, [onReset]);

    const inputRef = useRef();
    useEffect(() => {
        if (edit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef, edit]);

    useEffect(() => {
        setEdit(false);
    }, [postingId, draftId, setEdit]);

    return {edit, field, value, setValue, inputRef, onEdit, onReset, onKeyDown};
}
