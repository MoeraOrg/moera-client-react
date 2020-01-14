import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBackspace,
    faChevronDown,
    faClock,
    faCode,
    faCog,
    faExclamationTriangle,
    faFileAlt,
    faFrown,
    faHome,
    faNetworkWired,
    faPen,
    faRemoveFormat,
    faSignOutAlt,
    faThumbsDown,
    faThumbsUp,
    faUndoAlt,
    faUserCheck,
    faUserClock,
    faUserTimes
} from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import {
    faThumbsDown as faThumbsDownRegular,
    faThumbsUp as faThumbsUpRegular,
    faUser
} from '@fortawesome/free-regular-svg-icons';

export default function initIconLibrary() {
    library.add(faBackspace);
    library.add(faChevronDown);
    library.add(faClock);
    library.add(faCode);
    library.add(faCog);
    library.add(faExclamationTriangle);
    library.add(faFileAlt);
    library.add(faFrown);
    library.add(faHome);
    library.add(faNetworkWired);
    library.add(faMarkdown);
    library.add(faPen);
    library.add(faRemoveFormat);
    library.add(faSignOutAlt);
    library.add(faThumbsDown);
    library.add(faThumbsDownRegular);
    library.add(faThumbsUp);
    library.add(faThumbsUpRegular);
    library.add(faUndoAlt);
    library.add(faUser);
    library.add(faUserCheck);
    library.add(faUserClock);
    library.add(faUserTimes);
}
