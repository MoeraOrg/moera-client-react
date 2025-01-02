import React from 'react';
import cx from 'classnames';

import { PostingFeatures } from "api";
import { MarkdownEditor, MarkdownEditorProps } from "ui/control/richtexteditor/markdown/MarkdownEditor";
import VisualEditor, { VisualEditorProps } from "ui/control/richtexteditor/visual/VisualEditor";
import RichTextEditorDropzone from "ui/control/richtexteditor/RichTextEditorDropzone";
import RichTextEditorDialogs from "ui/control/richtexteditor/RichTextEditorDialogs";
import RichTextEditorMedia from "ui/control/richtexteditor/RichTextEditorMedia";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./RichTextEditor.css";

type Props = {
    className?: string;
    features: PostingFeatures | null;
    nodeName?: RelNodeName | string;
    forceImageCompress?: boolean;
    noMedia?: boolean;
} & MarkdownEditorProps & VisualEditorProps;

export const RichTextEditor = ({
    name, value, features, rows, maxHeight, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
    hidingPanel, format, nodeName = REL_CURRENT, forceImageCompress, onChange, submitKey, onSubmit, onBlur, onUrls,
    noMedia
}: Props) => (
    <div className={cx("rich-text-editor", className)}>
        <RichTextEditorDialogs>
            <RichTextEditorMedia value={value} features={features} nodeName={nodeName}
                                 forceCompress={forceImageCompress} srcFormat={format}
                                 smileysEnabled={smileysEnabled} onChange={onChange}>
                {format.endsWith("/visual") ?
                    <VisualEditor value={value} rows={rows} maxHeight={maxHeight} placeholder={placeholder}
                                  autoFocus={autoFocus} disabled={disabled} smileysEnabled={smileysEnabled}
                                  hidingPanel={hidingPanel} submitKey={submitKey} onSubmit={onSubmit}
                                  onChange={onChange} onBlur={onBlur} onUrls={onUrls}/>
                :
                    <MarkdownEditor name={name} value={value} rows={rows} maxHeight={maxHeight}
                                    placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                                    disabled={disabled} smileysEnabled={smileysEnabled} hidingPanel={hidingPanel}
                                    format={format} submitKey={submitKey} onSubmit={onSubmit} onChange={onChange}
                                    onBlur={onBlur} onUrls={onUrls}/>
                }
                {!noMedia &&
                    <RichTextEditorDropzone value={value} hiding={hidingPanel} nodeName={nodeName ?? null}/>
                }
            </RichTextEditorMedia>
        </RichTextEditorDialogs>
    </div>
);
