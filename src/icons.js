import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAt,
    faBackspace,
    faBell,
    faCertificate,
    faChartBar,
    faChevronDown,
    faCode,
    faCog,
    faExclamationTriangle,
    faExternalLinkAlt,
    faFileAlt,
    faFrown,
    faHistory,
    faHome,
    faList,
    faNetworkWired,
    faNewspaper,
    faPen,
    faPenAlt,
    faPlus,
    faRemoveFormat,
    faReply,
    faSignOutAlt,
    faThumbsDown,
    faThumbsUp,
    faThumbtack,
    faTrashAlt,
    faUndoAlt,
    faUserCheck,
    faUserClock,
    faUserTimes
} from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import {
    faClock,
    faEnvelope,
    faEnvelopeOpen,
    faThumbsDown as faThumbsDownRegular,
    faThumbsUp as faThumbsUpRegular,
    faUser
} from '@fortawesome/free-regular-svg-icons';

export default function initIconLibrary() {
    library.add(faAt);
    library.add(faBackspace);
    library.add(faBell);
    library.add(faCertificate);
    library.add(faChartBar);
    library.add(faChevronDown);
    library.add(faClock);
    library.add(faCode);
    library.add(faCog);
    library.add(faEnvelope);
    library.add(faEnvelopeOpen);
    library.add(faExclamationTriangle);
    library.add(faExternalLinkAlt);
    library.add(faFileAlt);
    library.add(faFrown);
    library.add(faHistory);
    library.add(faHome);
    library.add(faNetworkWired);
    library.add(faList);
    library.add(faMarkdown);
    library.add(faNewspaper);
    library.add(faPen);
    library.add(faPenAlt);
    library.add(faPlus);
    library.add(faRemoveFormat);
    library.add(faReply);
    library.add(faSignOutAlt);
    library.add(faTrashAlt);
    library.add(faThumbsDown);
    library.add(faThumbsDownRegular);
    library.add(faThumbsUp);
    library.add(faThumbsUpRegular);
    library.add(faThumbtack);
    library.add(faUndoAlt);
    library.add(faUser);
    library.add(faUserCheck);
    library.add(faUserClock);
    library.add(faUserTimes);
}
