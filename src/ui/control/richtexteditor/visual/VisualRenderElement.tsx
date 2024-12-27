import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultElement, RenderElementProps } from 'slate-react';

import { isScriptureElement } from "ui/control/richtexteditor/visual/scripture";
import { useVisualEditorCommands } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { getImageDimensions } from "ui/control/richtexteditor/rich-text-image";
import { BlockMath, InlineMath } from "ui/katex";

export default function VisualRenderElement(props: RenderElementProps) {
    const {element, attributes, children} = props;

    const {formatFormula, formatImageEmbedded} = useVisualEditorCommands();
    const {t} = useTranslation();

    const onFormulaClick = () => setTimeout(() => formatFormula());

    const onImageEmbeddedClick = () => setTimeout(() => formatImageEmbedded());

    if (isScriptureElement(element)) {
        switch (element.type) {
            case "paragraph":
                return <p {...attributes}>{children}</p>;
            case "link":
                return <a href={element.href} {...attributes}>{children}</a>;
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
                return (
                    <div {...attributes} contentEditable={false}>
                        {children}<div dangerouslySetInnerHTML={{__html: element.code}}/>
                    </div>
                );
            case "details":
                return (
                    // @ts-ignore
                    <details open className="block-border block-border-blue" style={{"--bb-badge": `"${t("fold")}"`}}
                             {...attributes}>
                        {element.summary && <summary contentEditable={false}>{element.summary}</summary>}
                        {children}
                    </details>
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
            case "image-embedded": {
                const {width, height} = getImageDimensions(
                    element.standardSize ?? "large", element.customWidth, element.customHeight
                );
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
                          onClick={onImageEmbeddedClick}>
                        {children}
                        <img src={element.href} width={width ?? undefined} height={height ?? undefined}
                             alt="" style={style}/>
                    </span>
                );
            }
            case "figure-image": {
                const {width, height} = getImageDimensions(
                    element.standardSize ?? "large", element.customWidth, element.customHeight
                );
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
                    <div className="figure-image" {...attributes} contentEditable={false}
                          onClick={onImageEmbeddedClick}>
                        {children}
                        <figure>
                            <img src={element.href} width={width ?? undefined} height={height ?? undefined}
                                 alt="" style={style}/>
                            <figcaption>{element.caption}</figcaption>
                        </figure>
                    </div>
                );
            }
            default:
                return <DefaultElement {...props}/>;
        }
    } else {
        return <DefaultElement {...props}/>;
    }
}
