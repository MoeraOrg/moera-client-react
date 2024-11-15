import { DefaultElement, RenderElementProps } from 'slate-react';

import { isScriptureElement } from "ui/control/richtexteditor/visual/scripture";

export default function VisualRenderElement(props: RenderElementProps) {
    const {element, attributes, children} = props;

    if (isScriptureElement(element)) {
        switch (element.type) {
            case "paragraph":
                return <p {...attributes}>{children}</p>;
            default:
                return <DefaultElement {...props}/>;
        }
    } else {
        return <DefaultElement {...props}/>;
    }
}
