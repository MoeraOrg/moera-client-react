import { useMemo } from 'react';
import katex from 'katex';

export const useMath = (math: string, options?: katex.KatexOptions): string => (
    useMemo(() => katex.renderToString(math, options), [math, options])
);
