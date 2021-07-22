import { useField, FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik';

interface FieldUndoHelpers {
    undo: boolean;
    reset: boolean;
    onUndo: () => void;
    onReset: () => void;
}

type UndoableFieldProps<T> = [FieldInputProps<T>, FieldMetaProps<T>, FieldHelperProps<T>, FieldUndoHelpers];

export function useUndoableField<T>(name: string,
                                    initialValue?: T | null,
                                    defaultValue?: T | null): UndoableFieldProps<T> {
    const [inputProps, metaProps, helperProps] = useField<T>(name);

    const undoHelpers: FieldUndoHelpers = {
        undo: initialValue != null && metaProps.value !== initialValue,
        reset: defaultValue != null && metaProps.value !== defaultValue,
        onUndo: () => initialValue != null && helperProps.setValue(initialValue),
        onReset: () => defaultValue != null && helperProps.setValue(defaultValue)
    };

    return [inputProps, metaProps, helperProps, undoHelpers];
}
