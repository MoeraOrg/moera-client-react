import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import 'quill/dist/quill.snow.css';
import { Attributor, Scope } from 'parchment';

import Blockquote from "ui/control/richtexteditor/visual/Blockquote";
import QuotableHeader from "ui/control/richtexteditor/visual/QuotableHeader";
import QuotableListItem from "ui/control/richtexteditor/visual/QuotableList";

import SnowExtendedTheme from "ui/control/richtexteditor/visual/SnowExtendedTheme";

const QuoteLevelAttribute = new Attributor("quote-level", "data-quote-level", {
    scope: Scope.BLOCK,
});

Quill.register("modules/magicUrl", MagicUrl);
Quill.register(Blockquote, true);
Quill.register(QuotableHeader, true);
Quill.register(QuotableListItem, true);
Quill.register(QuoteLevelAttribute);
Quill.register("themes/snow-extended", SnowExtendedTheme);

export type { QuillOptions, Range } from 'quill';
export default Quill;
