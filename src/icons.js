import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faClock, faExclamationTriangle, faFrown } from '@fortawesome/free-solid-svg-icons';

export default function initIconLibrary() {
    library.add(faChevronDown);
    library.add(faClock);
    library.add(faExclamationTriangle);
    library.add(faFrown);
}
