import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowDown,
    faArrowUp,
    faAt,
    faBackspace,
    faBell,
    faCertificate,
    faChartBar,
    faChevronDown,
    faCode,
    faCog,
    faComment,
    faExclamationTriangle,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faFastBackward,
    faFastForward,
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
    faRetweet,
    faShareSquare,
    faSignOutAlt,
    faStar,
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
    faComment as faCommentRegular,
    faEnvelope,
    faEnvelopeOpen,
    faThumbsDown as faThumbsDownRegular,
    faThumbsUp as faThumbsUpRegular,
    faUser
} from '@fortawesome/free-regular-svg-icons';

export default function initIconLibrary() {
    library.add(faArrowDown);
    library.add(faArrowUp);
    library.add(faAt);
    library.add(faBackspace);
    library.add(faBell);
    library.add(faCertificate);
    library.add(faChartBar);
    library.add(faChevronDown);
    library.add(faClock);
    library.add(faCode);
    library.add(faCog);
    library.add(faComment);
    library.add(faCommentRegular);
    library.add(faEnvelope);
    library.add(faEnvelopeOpen);
    library.add(faExclamationTriangle);
    library.add(faExternalLinkAlt);
    library.add(faEye);
    library.add(faEyeSlash);
    library.add(faFastBackward);
    library.add(faFastForward);
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
    library.add(faRetweet);
    library.add(faShareSquare);
    library.add(faSignOutAlt);
    library.add(faStar);
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
