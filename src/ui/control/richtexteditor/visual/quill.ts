import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import 'quill/dist/quill.snow.css';

import BlockquoteBlot from "ui/control/richtexteditor/visual/BlockquoteBlot";

Quill.register("modules/magicUrl", MagicUrl);
Quill.register(BlockquoteBlot, true);

export type { QuillOptions } from 'quill';
export default Quill;
