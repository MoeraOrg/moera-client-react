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
    faRemoveFormat,
    faSignOutAlt,
    faUndoAlt
} from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';

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
    library.add(faRemoveFormat);
    library.add(faSignOutAlt);
    library.add(faUndoAlt);
}
