import { DefaultElement, RenderElementProps } from 'slate-react';

import { isScriptureElement } from "ui/control/richtexteditor/visual/scripture";

export default function VisualRenderElement(props: RenderElementProps) {
    const {element, attributes, children} = props;

    if (isScriptureElement(element)) {
        switch (element.type) {
            case "paragraph":
                return <p {...attributes}>{children}</p>;
            case "link":
                return <a href={element.href} {...attributes}>{children}</a>;
            case "spoiler":
                return <span className="spoiler" {...attributes}>{children}</span>;
            case "spoiler-block":
                return <div className="spoiler" {...attributes}>{children}</div>;
            case "mention":
                return <span className="mention" {...attributes}>{children}</span>;
            case "horizontal-rule":
                return <div {...attributes}>{children}<hr/></div>;
            case "blockquote":
                return <blockquote {...attributes}>{children}</blockquote>;
            case "list-unordered":
                return <ul {...attributes}>{children}</ul>;
            case "list-ordered":
                return <ol {...attributes}>{children}</ol>;
            case "list-item":
                return <li {...attributes}>{children}</li>;
            default:
                return <DefaultElement {...props}/>;
        }
    } else {
        return <DefaultElement {...props}/>;
    }
}
