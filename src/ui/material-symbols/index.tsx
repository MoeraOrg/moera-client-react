import * as React from 'react';

import { ReactComponent as msAddLink } from "ui/material-symbols/add_link.isvg";
import { ReactComponent as msAddPhotoAlternate } from "ui/material-symbols/add_photo_alternate.isvg";
import { ReactComponent as msAddReaction } from "ui/material-symbols/add_reaction.isvg";
import { ReactComponent as msAlternateEmail } from "ui/material-symbols/alternate_email.isvg";
import { ReactComponent as msExpandCircleDown } from "ui/material-symbols/expand_circle_down.isvg";
import { ReactComponent as msFormatBold } from "ui/material-symbols/format_bold.isvg";
import { ReactComponent as msFormatClear } from "ui/material-symbols/format_clear.isvg";
import { ReactComponent as msFormatIndentDecrease } from "ui/material-symbols/format_indent_decrease.isvg";
import { ReactComponent as msFormatIndentIncrease } from "ui/material-symbols/format_indent_increase.isvg";
import { ReactComponent as msFormatItalic } from "ui/material-symbols/format_italic.isvg";
import { ReactComponent as msHorizontalRule } from "ui/material-symbols/horizontal_rule.isvg";
import { ReactComponent as msFormatListBulleted } from "ui/material-symbols/format_list_bulleted.isvg";
import { ReactComponent as msFormatListNumbered } from "ui/material-symbols/format_list_numbered.isvg";
import { ReactComponent as msFormatQuote } from "ui/material-symbols/format_quote.isvg";
import { ReactComponent as msFormatQuoteOff } from "ui/material-symbols/format_quote_off.isvg";
import { ReactComponent as msFormatStrikethrough } from "ui/material-symbols/format_strikethrough.isvg";
import { ReactComponent as msReport } from "ui/material-symbols/report.isvg";

export {
    msAddLink,
    msAddPhotoAlternate,
    msAddReaction,
    msAlternateEmail,
    msExpandCircleDown,
    msFormatBold,
    msFormatClear,
    msFormatIndentDecrease,
    msFormatIndentIncrease,
    msFormatItalic,
    msHorizontalRule,
    msFormatListBulleted,
    msFormatListNumbered,
    msFormatQuote,
    msFormatQuoteOff,
    msFormatStrikethrough,
    msReport
};

export type MaterialSymbol = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
