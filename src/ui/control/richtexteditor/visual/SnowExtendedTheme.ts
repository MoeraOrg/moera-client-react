import SnowTheme from 'quill/themes/snow';
import Toolbar from 'quill/modules/toolbar';
import Icons from 'quill/ui/icons';

import FormatQuoteIcon from "ui/control/richtexteditor/visual/icons/format_quote.isvg";
import FormatQuoteOffIcon from "ui/control/richtexteditor/visual/icons/format_quote_off.isvg";

const SNOW_EXTENDED_ICONS = {
    ...Icons,
    blockquote: FormatQuoteIcon,
    "blockquote-off": FormatQuoteOffIcon
}

export default class SnowExtendedTheme extends SnowTheme {

    extendToolbar(toolbar: Toolbar) {
        super.extendToolbar(toolbar);

        if (toolbar.container != null) {
            this.buildButtons(toolbar.container.querySelectorAll("button"), SNOW_EXTENDED_ICONS);
            this.buildPickers(toolbar.container.querySelectorAll("select"), SNOW_EXTENDED_ICONS);
        }
    }

}
