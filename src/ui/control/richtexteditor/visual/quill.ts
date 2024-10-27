import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import { Attributor, Scope } from 'parchment';
import { EmojiModule } from '@rytrox/quill-emoji-mart';
import 'quill/dist/quill.snow.css';

import Spoiler from "ui/control/richtexteditor/visual/Spoiler";
import SpoilerBlock from "ui/control/richtexteditor/visual/SpoilerBlock";
import Blockquote from "ui/control/richtexteditor/visual/Blockquote";
import QuotableHeader from "ui/control/richtexteditor/visual/QuotableHeader";
import SpoilerableListItem from "ui/control/richtexteditor/visual/SpoilerableList";
import Mention from "ui/control/richtexteditor/visual/Mention";
import HorizontalRule from "ui/control/richtexteditor/visual/HorizontalRule";
import SnowExtendedTheme from "ui/control/richtexteditor/visual/SnowExtendedTheme";

const QuoteLevelAttribute = new Attributor("quote-level", "data-quote-level", {
    scope: Scope.BLOCK,
});

const SpoilerItemAttribute = new Attributor("spoiler-item", "data-spoiler-message", {
    scope: Scope.BLOCK,
});

Quill.register("modules/magicUrl", MagicUrl);
Quill.register("modules/emoji", EmojiModule);
Quill.register(Spoiler);
Quill.register(SpoilerBlock);
Quill.register(Blockquote, true);
Quill.register(QuotableHeader, true);
Quill.register(SpoilerableListItem, true);
Quill.register(Mention);
Quill.register(HorizontalRule);
Quill.register(QuoteLevelAttribute);
Quill.register(SpoilerItemAttribute);
Quill.register("themes/snow-extended", SnowExtendedTheme);

export type { QuillOptions } from 'quill';
export { Range } from 'quill';
export default Quill;
