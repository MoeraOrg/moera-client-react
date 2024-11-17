import { RenderLeafProps } from 'slate-react';
import { ScriptureText } from "ui/control/richtexteditor/visual/scripture";

export default function VisualRenderLeaf(props: RenderLeafProps) {
    const leaf: ScriptureText = props.leaf;

    return (
        <span
            {...props.attributes}
            style={{
                fontWeight: leaf.bold ? "bold" : "normal",
                fontStyle: leaf.italic ? "italic" : "normal",
                textDecorationLine: leaf.strikeout ? "line-through" : "none",
            }}
        >
          {props.children}
        </span>
    )
}
