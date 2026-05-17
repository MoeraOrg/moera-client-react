import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultElement, RenderElementProps } from 'slate-react';

import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { getImageDimensions } from "ui/control/richtexteditor/media/rich-text-image";
import { isScriptureElement } from "ui/control/richtexteditor/visual/scripture";
import { isSignificant } from "ui/control/richtexteditor/visual/scripture-html";
import OpenLink from "ui/control/richtexteditor/visual/OpenLink";
import DetailsSummary from "ui/control/richtexteditor/visual/DetailsSummary";
import VisualRenderFigure from "ui/control/richtexteditor/visual/VisualRenderFigure";
import VisualRenderIframe from "ui/control/richtexteditor/visual/VisualRenderIframe";
import VisualRenderImage from "ui/control/richtexteditor/visual/VisualRenderImage";
import { BlockMath, InlineMath } from "ui/katex";
import { useIsTinyScreen } from "ui/hook";
import { REL_CURRENT } from "util/rel-node-name";

export default function VisualRenderElement(props: RenderElementProps) {
    const {element, attributes, children} = props;

    const tinyScreen = useIsTinyScreen();
    const {formatFormula, formatImage} = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onFormulaClick = () => setTimeout(() => formatFormula());

    const onImageClick = () => setTimeout(() => formatImage());

    if (isScriptureElement(element)) {
        switch (element.type) {
            case "paragraph":
                return <p {...attributes}>{children}</p>;
            case "link":
                return (
                    <span className="link" {...attributes}>
                        {children}{!tinyScreen && isSignificant(element.children) && <OpenLink href={element.href}/>}
                    </span>
                );
            case "spoiler":
                return <span className="spoiler" {...attributes}>{children}</span>;
            case "spoiler-block":
                return (
                    // @ts-ignore
                    <div className="block-border block-border-gray"  style={{"--bb-badge": `"${t("spoiler")}"`}}
                         {...attributes}>
                        {children}
                    </div>
                );
            case "mention":
                return <span className="mention" {...attributes}>{children}</span>;
            case "horizontal-rule":
                return <div {...attributes} contentEditable={false}>{children}<hr/></div>;
            case "blockquote":
                return <blockquote {...attributes}>{children}</blockquote>;
            case "list-item": {
                const listClass = (element.ordered ? "ol-" : "ul-") + element.level;
                return <div className={`list-item ${listClass}`} {...attributes}>{children}</div>;
            }
            case "heading": {
                const tagName = `h${element.level}`;
                return React.createElement(tagName, attributes, ...children);
            }
            case "iframe":
                return <VisualRenderIframe attributes={attributes} code={element.code}>{children}</VisualRenderIframe>;
            case "details":
                return (
                    // @ts-ignore
                    <div className="block-border block-border-blue" style={{"--bb-badge": `"${t("fold")}"`}}
                             {...attributes}>
                        <DetailsSummary summary={element.summary} style={element.style} elementId={element.id}/>
                        {children}
                    </div>
                );
            case "code-block":
                return (
                    // @ts-ignore
                    <pre className="block-border block-border-red"  style={{"--bb-badge": `"${t("code")}"`}}
                         {...attributes}>
                        {children}
                    </pre>
                );
            case "formula":
                return (
                    <span className="formula" {...attributes} contentEditable={false} onClick={onFormulaClick}>
                        {children}<InlineMath math={element.content}/>
                    </span>
                );
            case "formula-block":
                return (
                    <div className="formula" {...attributes} contentEditable={false} onClick={onFormulaClick}>
                        {children}<BlockMath math={element.content}/>
                    </div>
                );
            case "image": {
                const {width, height} = getImageDimensions(
                    element.standardSize ?? "large", element.customWidth, element.customHeight
                );

                if (element.href != null) {
                    let style: React.CSSProperties = {};
                    if (width != null) {
                        // @ts-ignore
                        style["--width"] = `${width}px`;
                    }
                    if (height != null) {
                        // @ts-ignore
                        style["--height"] = `${height}px`;
                    }
                    return (
                        <span className="image-embedded" {...attributes} contentEditable={false}
                              onClick={onImageClick}>
                            {children}
                            <img src={element.href} width={width ?? undefined} height={height ?? undefined}
                                 alt="" style={style}/>
                        </span>
                    );
                } else if (element.mediaFile != null) {
                    return (
                        <VisualRenderImage attributes={attributes} media={element.mediaFile} nodeName={REL_CURRENT}
                                           width={width} height={height} onClick={onImageClick}>
                            {children}
                        </VisualRenderImage>
                    );
                } else {
                    return <DefaultElement {...props}/>;
                }
            }
            case "figure-image": {
                const {width, height} = getImageDimensions(
                    element.standardSize ?? "large", element.customWidth, element.customHeight
                );

                if (element.href != null) {
                    let style: React.CSSProperties = {};
                    if (width != null) {
                        // @ts-ignore
                        style["--width"] = `${width}px`;
                    }
                    if (height != null) {
                        // @ts-ignore
                        style["--height"] = `${height}px`;
                    }
                    return (
                        <div className="figure-image-embedded" {...attributes} contentEditable={false}
                              onClick={onImageClick}>
                            {children}
                            <figure>
                                <img src={element.href} width={width ?? undefined} height={height ?? undefined}
                                     alt="" style={style}/>
                                <figcaption>{element.caption}</figcaption>
                            </figure>
                        </div>
                    );
                } else if (element.mediaFile != null) {
                    return (
                        <VisualRenderFigure attributes={attributes} media={element.mediaFile} nodeName={REL_CURRENT}
                                           width={width} height={height} caption={element.caption}
                                            onClick={onImageClick}>
                            {children}
                        </VisualRenderFigure>
                    );
                } else {
                    return <DefaultElement {...props}/>;
                }
            }
            default:
                return <DefaultElement {...props}/>;
        }
    } else {
        return <DefaultElement {...props}/>;
    }
}
