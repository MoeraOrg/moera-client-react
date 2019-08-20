import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faExclamationTriangle, faFrown } from '@fortawesome/free-solid-svg-icons';

export default function initIconLibrary() {
    library.add(faClock);
    library.add(faExclamationTriangle);
    library.add(faFrown);
}
