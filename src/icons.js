import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faChevronDown,
    faClock,
    faCode,
    faExclamationTriangle,
    faFileAlt,
    faFrown,
    faRemoveFormat
} from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';

export default function initIconLibrary() {
    library.add(faChevronDown);
    library.add(faClock);
    library.add(faCode);
    library.add(faExclamationTriangle);
    library.add(faFileAlt);
    library.add(faFrown);
    library.add(faMarkdown);
    library.add(faRemoveFormat);
}
