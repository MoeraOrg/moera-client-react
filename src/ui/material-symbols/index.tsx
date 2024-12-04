import * as React from 'react';

import { ReactComponent as msAddLink } from "ui/material-symbols/add_link.isvg";
import { ReactComponent as msAddPhotoAlternate } from "ui/material-symbols/add_photo_alternate.isvg";
import { ReactComponent as msAddReaction } from "ui/material-symbols/add_reaction.isvg";
import { ReactComponent as msAlternateEmail } from "ui/material-symbols/alternate_email.isvg";
import { ReactComponent as msArrowDropDown } from "ui/material-symbols/arrow_drop_down.isvg";
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
import { ReactComponent as msReport } from "ui/material-symbols/report.isvg";
import { ReactComponent as msStrikethroughS } from "ui/material-symbols/strikethrough_s.isvg";

export {
    msAddLink,
    msAddPhotoAlternate,
    msAddReaction,
    msAlternateEmail,
    msArrowDropDown,
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
    msReport,
    msStrikethroughS
};

export type MaterialSymbol = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

interface IconProps {
    icon: MaterialSymbol;
    fill?: string;
}

export const Icon = ({icon, fill}: IconProps) =>
    React.createElement(icon, {fill: fill ?? "currentColor"});
