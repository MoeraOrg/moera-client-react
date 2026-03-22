import React, { memo } from 'react';
import { RenderElementProps } from 'slate-react';
import deepEqual from 'react-fast-compare';

interface Props {
    attributes: RenderElementProps["attributes"];
    code: string;
    children: any;
}

function VisualRenderIframeImpl({attributes, code, children}: Props) {
    return (
        <div {...attributes} contentEditable={false}>
            {children}<div dangerouslySetInnerHTML={{__html: code}}/>
        </div>
    );
}

const VisualRenderIframe = memo(VisualRenderIframeImpl, deepEqual);

export default VisualRenderIframe;
