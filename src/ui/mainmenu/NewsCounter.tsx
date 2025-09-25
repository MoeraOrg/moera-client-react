import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getFeedNotViewed } from "state/feeds/selectors";
import { REL_HOME } from "util/rel-node-name";

export default function NewsCounter() {
    const count = useSelector((state: ClientState) => getFeedNotViewed(state, REL_HOME, "news"));

    return count ? <span className="badge news-counter">{count}</span> : null;
}
