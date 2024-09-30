import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import 'quill/dist/quill.snow.css';
export { useQuill } from 'react-quilljs';

Quill.register("modules/magicUrl", MagicUrl);
