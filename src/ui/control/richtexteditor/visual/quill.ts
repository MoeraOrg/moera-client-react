import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import { Attributor, Scope } from 'parchment';
import { EmojiModule } from '@rytrox/quill-emoji-mart';
import 'quill/dist/quill.snow.css';

import Spoiler from "ui/control/richtexteditor/visual/Spoiler";
import Blockquote from "ui/control/richtexteditor/visual/Blockquote";
import QuotableHeader from "ui/control/richtexteditor/visual/QuotableHeader";
import QuotableListItem from "ui/control/richtexteditor/visual/QuotableList";
import Mention from "ui/control/richtexteditor/visual/Mention";
import HorizontalRule from "ui/control/richtexteditor/visual/HorizontalRule";
import SnowExtendedTheme from "ui/control/richtexteditor/visual/SnowExtendedTheme";

const QuoteLevelAttribute = new Attributor("quote-level", "data-quote-level", {
    scope: Scope.BLOCK,
});

Quill.register("modules/magicUrl", MagicUrl);
Quill.register("modules/emoji", EmojiModule);
Quill.register(Spoiler);
Quill.register(Blockquote, true);
Quill.register(QuotableHeader, true);
Quill.register(QuotableListItem, true);
Quill.register(Mention);
Quill.register(HorizontalRule);
Quill.register(QuoteLevelAttribute);
Quill.register("themes/snow-extended", SnowExtendedTheme);

export type { QuillOptions } from 'quill';
export { Range } from 'quill';
export default Quill;
