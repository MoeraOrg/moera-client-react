import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultElement, RenderElementProps } from 'slate-react';

import { isScriptureElement } from "ui/control/richtexteditor/visual/scripture";

export default function VisualRenderElement(props: RenderElementProps) {
    const {element, attributes, children} = props;

    const {t} = useTranslation();

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
            default:
                return <DefaultElement {...props}/>;
        }
    } else {
        return <DefaultElement {...props}/>;
    }
}
