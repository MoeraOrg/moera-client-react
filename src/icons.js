import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle, faFrown } from '@fortawesome/free-solid-svg-icons';

export default function initIconLibrary() {
    library.add(faExclamationTriangle);
    library.add(faFrown);
}
