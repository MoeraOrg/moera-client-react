import { RenderLeafProps } from 'slate-react';
import { ScriptureText } from "ui/control/richtexteditor/visual/scripture";

export default function VisualRenderLeaf(props: RenderLeafProps) {
    if ("placeholder" in props.leaf) {
        return <span {...props.attributes}>{props.children}</span>;
    }

    const leaf: ScriptureText = props.leaf;

    return (
        <span
            {...props.attributes}
            style={{
                position: leaf.supsub ? "relative" : undefined,
                lineHeight: leaf.supsub ? 0 : undefined,
                verticalAlign: leaf.supsub ? "baseline" : undefined,
                top: leaf.supsub && leaf.supsub > 0 ? "-.5em" : undefined,
                bottom: leaf.supsub && leaf.supsub < 0 ? "-.25em" : undefined,
                fontSize: leaf.code ? ".875em" : (leaf.supsub ? ".75em" : undefined),
                fontWeight: leaf.bold ? "bold" : undefined,
                fontStyle: leaf.italic ? "italic" : undefined,
                textDecorationLine: leaf.strikeout ? "line-through" : undefined,
                color: leaf.code ? "var(--bs-code-color)" : undefined,
                backgroundColor: leaf.mark ? "var(--bs-highlight-bg)" : undefined,
                wordWrap: leaf.code ? "break-word" : undefined,
            }}
        >
          {props.children}
        </span>
    )
}
