import { useMemo } from 'react';
import KaTeX from 'katex';

export const useMath = (math: string, options?: KaTeX.KatexOptions): string => (
    useMemo(() => KaTeX.renderToString(math, options), [math, options])
);
