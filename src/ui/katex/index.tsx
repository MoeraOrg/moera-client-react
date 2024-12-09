import React, { Suspense } from 'react';

import { InlineMathProps } from "ui/katex/InlineMath";
import { BlockMathProps } from "ui/katex/BlockMath";

const InlineMathImpl = React.lazy(() => import("ui/katex/InlineMath"));
const BlockMathImpl = React.lazy(() => import("ui/katex/BlockMath"));

export const InlineMath = (props: InlineMathProps) => (
    <Suspense fallback={<>Loading math...</>}>
        <InlineMathImpl {...props}/>
    </Suspense>
);

export const BlockMath = (props: BlockMathProps) => (
    <Suspense fallback={<>Loading math...</>}>
        <BlockMathImpl {...props}/>
    </Suspense>
);
