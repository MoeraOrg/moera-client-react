import { useSelector } from 'react-redux';

import { getNavigationPrevious } from "state/navigation/selectors";

export interface BackTarget {
    backNodeName: string | undefined;
    backHref: string;
    backTitle: string;
}

export function useBackTarget(defaultSupplier: () => BackTarget): BackTarget {
    const prevPage = useSelector(getNavigationPrevious);

    const backNodeName = prevPage?.nodeName;
    const backHref = prevPage?.location;
    const backTitle = prevPage?.backTitle;

    return backHref && backTitle != null ? {backNodeName, backHref, backTitle} : defaultSupplier();
}
