import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowDown,
    faArrowUp,
    faAt,
    faBackspace,
    faBell,
    faBold,
    faCaretSquareDown,
    faCertificate,
    faChartBar,
    faChevronDown,
    faCode,
    faCog,
    faComment,
    faExclamationCircle,
    faExclamationTriangle,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faFastBackward,
    faFastForward,
    faFileAlt,
    faFrown,
    faHome,
    faImage,
    faItalic,
    faLink,
    faList,
    faMinus,
    faNetworkWired,
    faNewspaper,
    faPen,
    faPenAlt,
    faPlus,
    faQuestionCircle,
    faQuoteLeft,
    faRedoAlt,
    faRemoveFormat,
    faReply,
    faRetweet,
    faShareAlt,
    faShareSquare,
    faSignOutAlt,
    faStar,
    faStrikethrough,
    faSyncAlt,
    faTimes,
    faTimesCircle,
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
    faCircle,
    faClock,
    faComment as faCommentRegular,
    faEnvelope,
    faEnvelopeOpen,
    faSquare,
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
    library.add(faBold);
    library.add(faCaretSquareDown);
    library.add(faCertificate);
    library.add(faChartBar);
    library.add(faChevronDown);
    library.add(faCircle);
    library.add(faClock);
    library.add(faCode);
    library.add(faCog);
    library.add(faComment);
    library.add(faCommentRegular);
    library.add(faEnvelope);
    library.add(faEnvelopeOpen);
    library.add(faExclamationCircle);
    library.add(faExclamationTriangle);
    library.add(faExternalLinkAlt);
    library.add(faEye);
    library.add(faEyeSlash);
    library.add(faFastBackward);
    library.add(faFastForward);
    library.add(faFileAlt);
    library.add(faFrown);
    library.add(faHome);
    library.add(faImage);
    library.add(faItalic);
    library.add(faMinus);
    library.add(faNetworkWired);
    library.add(faLink);
    library.add(faList);
    library.add(faMarkdown);
    library.add(faNewspaper);
    library.add(faPen);
    library.add(faPenAlt);
    library.add(faPlus);
    library.add(faQuestionCircle);
    library.add(faQuoteLeft);
    library.add(faRedoAlt);
    library.add(faRemoveFormat);
    library.add(faReply);
    library.add(faRetweet);
    library.add(faShareAlt);
    library.add(faShareSquare);
    library.add(faSignOutAlt);
    library.add(faSquare);
    library.add(faStar);
    library.add(faStrikethrough);
    library.add(faSyncAlt);
    library.add(faTimes);
    library.add(faTimesCircle);
    library.add(faThumbsDown);
    library.add(faThumbsDownRegular);
    library.add(faThumbsUp);
    library.add(faThumbsUpRegular);
    library.add(faThumbtack);
    library.add(faTrashAlt);
    library.add(faUndoAlt);
    library.add(faUser);
    library.add(faUserCheck);
    library.add(faUserClock);
    library.add(faUserTimes);
}