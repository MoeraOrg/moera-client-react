import React, { ReactNode, useCallback } from 'react';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { PostingFeatures, SourceFormat } from "api";
import { FormGroup } from "ui/control";
import {
    RichTextEditor,
    RichTextEditorPanelMode,
    RichTextLinkPreviews,
    RichTextValue
} from "ui/control/richtexteditor";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";

interface Props {
    name: string;
    title?: string;
    rows?: number;
    minHeight?: string | null;
    maxHeight?: string | null;
    features?: PostingFeatures | null;
    noComplexBlocks?: boolean | null;
    noEmbeddedMedia?: boolean | null;
    noMedia?: boolean | null;
    noVideo?: boolean | null;
    nodeName?: RelNodeName | string;
    forceImageCompress?: boolean;
    placeholder?: string | null;
    autoFocus?: boolean;
    anyValue?: boolean;
    className?: string;
    autoComplete?: string;
    noFeedback?: boolean;
    disabled?: boolean;
    initialValue?: RichTextValue;
    defaultValue?: RichTextValue;
    smileysEnabled?: boolean;
    commentQuote?: boolean;
    panelMode?: RichTextEditorPanelMode;
    format: SourceFormat;
    submitKey?: string;
    onSubmit?: () => void;
    urlsField?: string;
    linkPreviewsField?: string;
    linkPreviewsSmall?: boolean | null;
    children?: ReactNode;
}

export function RichTextField({
    name, title, rows = 3, minHeight, maxHeight, features, noComplexBlocks, noEmbeddedMedia, noMedia, noVideo,
    nodeName = REL_CURRENT, forceImageCompress, placeholder, autoFocus, anyValue, className, autoComplete,
    noFeedback = false, disabled = false, initialValue, defaultValue, smileysEnabled, commentQuote, panelMode, format,
    submitKey, onSubmit, urlsField, linkPreviewsField, linkPreviewsSmall, children
}: Props) {
    const [{value, onBlur}, {touched, error}, {setTouched}, {undo, reset, onUndo, onReset}] =
        useUndoableField<RichTextValue>(name, initialValue, defaultValue);
    const {setFieldValue} = useFormikContext();
    const {t} = useTranslation();

    // useCallback() and setFieldValue() (not setValue()) is mandatory here
    const onChange = useCallback(
        (v: RichTextValue, converted: boolean) => {
            setFieldValue(name, v);
            setTouched(!converted, false);
        },
        [name, setFieldValue, setTouched]
    );
    const onUrls = useCallback((v: string[]) => urlsField && setFieldValue(urlsField, v), [urlsField, setFieldValue]);

    return (
        <FormGroup
            title={title}
            name={name}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <>
                <RichTextEditor
                    name={name}
                    value={value}
                    touched={touched}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={cx(
                        "form-control", {
                            "is-valid": !anyValue && touched && !error,
                            "is-invalid": !anyValue && touched && error,
                            [className!]: !!className
                        }
                    )}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    minHeight={minHeight}
                    maxHeight={maxHeight}
                    placeholder={placeholder ?? t("enter-text-here")}
                    rows={rows}
                    features={features ?? null}
                    disabled={disabled}
                    smileysEnabled={smileysEnabled}
                    commentQuote={commentQuote}
                    panelMode={panelMode}
                    format={format}
                    submitKey={submitKey}
                    onSubmit={onSubmit}
                    onUrls={urlsField != null ? onUrls : undefined}
                    noComplexBlocks={noComplexBlocks}
                    noEmbeddedMedia={noEmbeddedMedia}
                    noMedia={noMedia}
                    noVideo={noVideo}
                    nodeName={nodeName}
                    forceImageCompress={forceImageCompress}
                    children={children}
                />
                {!noFeedback && touched && <FieldError error={(error as any)?.text}/>}
                {urlsField != null && linkPreviewsField != null &&
                    <RichTextLinkPreviews
                        name={linkPreviewsField}
                        urlsField={urlsField}
                        nodeName={nodeName}
                        features={features}
                        small={linkPreviewsSmall}
                        disabled={disabled}
                    />
                }
            </>
        </FormGroup>
    );
}
