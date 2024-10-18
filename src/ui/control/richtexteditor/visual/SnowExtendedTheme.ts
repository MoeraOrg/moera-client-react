import SnowTheme from 'quill/themes/snow';
import Toolbar from 'quill/modules/toolbar';
import Icons from 'quill/ui/icons';

import AddLinkIcon from "ui/control/richtexteditor/visual/icons/add_link.isvg";
import AddPhotoAlternateIcon from "ui/control/richtexteditor/visual/icons/add_photo_alternate.isvg";
import AlternateEmailIcon from "ui/control/richtexteditor/visual/icons/alternate_email.isvg";
import FormatBoldIcon from "ui/control/richtexteditor/visual/icons/format_bold.isvg";
import FormatClearIcon from "ui/control/richtexteditor/visual/icons/format_clear.isvg";
import FormatIndentDecreaseIcon from "ui/control/richtexteditor/visual/icons/format_indent_decrease.isvg";
import FormatIndentIncreaseIcon from "ui/control/richtexteditor/visual/icons/format_indent_increase.isvg";
import FormatItalicIcon from "ui/control/richtexteditor/visual/icons/format_italic.isvg";
import HorizontalRuleIcon from "ui/control/richtexteditor/visual/icons/horizontal_rule.isvg";
import FormatListBulletedIcon from "ui/control/richtexteditor/visual/icons/format_list_bulleted.isvg";
import FormatListNumberedIcon from "ui/control/richtexteditor/visual/icons/format_list_numbered.isvg";
import FormatQuoteIcon from "ui/control/richtexteditor/visual/icons/format_quote.isvg";
import FormatQuoteOffIcon from "ui/control/richtexteditor/visual/icons/format_quote_off.isvg";
import FormatStrikethroughIcon from "ui/control/richtexteditor/visual/icons/format_strikethrough.isvg";
import ReportIcon from "ui/control/richtexteditor/visual/icons/report.isvg";
import LinkTooltip from "ui/control/richtexteditor/visual/icons/LinkTooltip";

const SNOW_EXTENDED_ICONS = {
    ...Icons,
    bold: FormatBoldIcon,
    italic: FormatItalicIcon,
    strike: FormatStrikethroughIcon,
    spoiler: ReportIcon,
    list: {
        ordered: FormatListNumberedIcon,
        bullet: FormatListBulletedIcon,
    },
    indent: {
        "+1": FormatIndentIncreaseIcon,
        "-1": FormatIndentDecreaseIcon,
    },
    blockquote: FormatQuoteIcon,
    "blockquote-off": FormatQuoteOffIcon,
    "horizontal-rule": HorizontalRuleIcon,
    mention: AlternateEmailIcon,
    image: AddPhotoAlternateIcon,
    link: AddLinkIcon,
    clean: FormatClearIcon,
}

export default class SnowExtendedTheme extends SnowTheme {

    extendToolbar(toolbar: Toolbar) {
        super.extendToolbar(toolbar);

        if (toolbar.container != null) {
            this.buildButtons(toolbar.container.querySelectorAll("button"), SNOW_EXTENDED_ICONS);
            this.buildPickers(toolbar.container.querySelectorAll("select"), SNOW_EXTENDED_ICONS);
        }

        this.tooltip = new LinkTooltip(this.quill, this.options.bounds);
    }

}
