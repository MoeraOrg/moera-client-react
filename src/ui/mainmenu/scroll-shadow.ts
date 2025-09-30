import { RefObject, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { useIntersect } from "ui/hook";

interface ScrollShadow {
    shadow: boolean;
    sentinel: RefObject<any>;
}

export function useScrollShadow(): ScrollShadow {
    const connectedToHome = useSelector(isConnectedToHome);
    const [shadow, setShadow] = useState<boolean>(false);

    const onIntersect = useCallback(
        (intersecting: boolean) => setShadow(!intersecting),
        [setShadow]
    );

    const margin = connectedToHome ? 50 : 100;
    const sentinel = useIntersect(onIntersect, {rootMargin: `-${margin}px 0px 0px 0px`});

    return {shadow, sentinel};
}
