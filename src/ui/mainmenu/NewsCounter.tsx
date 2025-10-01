import { useSelector } from 'react-redux';

import { getNewsCount } from "state/feeds/selectors";

export default function NewsCounter() {
    const count = useSelector(getNewsCount);

    return count > 0 ? <span className="badge news-counter">{count}</span> : null;
}
