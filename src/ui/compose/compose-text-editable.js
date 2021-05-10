import { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';

export default function useComposeTextEditable(name, postingId, draftId) {
    const [field, {value, initialValue}, {setValue}] = useField(name);
    const [edit, setEdit] = useState(false);

    const onEdit = () => setEdit(true);

    const onReset = () => {
        setValue(initialValue);
        setEdit(false);
    };

    const onKeyDown = event => {
        if (event.key === "Escape" && onReset) {
            onReset();
        }
    };

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
