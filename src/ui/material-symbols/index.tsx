import * as React from 'react';

import { ReactComponent as msAddLink } from "ui/material-symbols/add_link.isvg";
import { ReactComponent as msAlternateEmail } from "ui/material-symbols/alternate_email.isvg";
import { ReactComponent as msClose } from "ui/material-symbols/close.isvg";
import { ReactComponent as msCode } from "ui/material-symbols/code.isvg";
import { ReactComponent as msCodeBlocks } from "ui/material-symbols/code_blocks.isvg";
import { ReactComponent as msExpandCircleDown } from "ui/material-symbols/expand_circle_down.isvg";
import { ReactComponent as msFileSave } from "ui/material-symbols/file_save.svg";
import { ReactComponent as msFormatBold } from "ui/material-symbols/format_bold.isvg";
import { ReactComponent as msFormatClear } from "ui/material-symbols/format_clear.isvg";
import { ReactComponent as msFormatIndentDecrease } from "ui/material-symbols/format_indent_decrease.isvg";
import { ReactComponent as msFormatIndentIncrease } from "ui/material-symbols/format_indent_increase.isvg";
import { ReactComponent as msFormatInkHighlighter } from "ui/material-symbols/format_ink_highlighter.isvg";
import { ReactComponent as msFormatItalic } from "ui/material-symbols/format_italic.isvg";
import { ReactComponent as msHorizontalRule } from "ui/material-symbols/horizontal_rule.isvg";
import { ReactComponent as msFormatListBulleted } from "ui/material-symbols/format_list_bulleted.isvg";
import { ReactComponent as msFormatListNumbered } from "ui/material-symbols/format_list_numbered.isvg";
import { ReactComponent as msFormatQuote } from "ui/material-symbols/format_quote.isvg";
import { ReactComponent as msFormatQuoteOff } from "ui/material-symbols/format_quote_off.isvg";
import { ReactComponent as msFunction } from "ui/material-symbols/function.isvg";
import { ReactComponent as msMediaLink } from "ui/material-symbols/media_link.isvg";
import { ReactComponent as msMoreHoriz } from "ui/material-symbols/more_horiz.isvg";
import { ReactComponent as msMoreVert } from "ui/material-symbols/more_vert.isvg";
import { ReactComponent as msPhotoLibrary } from "ui/material-symbols/photo_library.isvg";
import { ReactComponent as msReport } from "ui/material-symbols/report.isvg";
import { ReactComponent as msSatellite } from "ui/material-symbols/satellite.isvg";
import { ReactComponent as msSentimentSatisfied } from "ui/material-symbols/sentiment_satisfied.isvg";
import { ReactComponent as msStrikethroughS } from "ui/material-symbols/strikethrough_s.isvg";
import { ReactComponent as msSubscript } from "ui/material-symbols/subscript.isvg";
import { ReactComponent as msSuperscript } from "ui/material-symbols/superscript.isvg";
import { ReactComponent as msVideoLibrary } from "ui/material-symbols/video_library.isvg";

export {
    msAddLink,
    msAlternateEmail,
    msClose,
    msCode,
    msCodeBlocks,
    msExpandCircleDown,
    msFileSave,
    msFormatBold,
    msFormatClear,
    msFormatIndentDecrease,
    msFormatIndentIncrease,
    msFormatInkHighlighter,
    msFormatItalic,
    msFunction,
    msHorizontalRule,
    msFormatListBulleted,
    msFormatListNumbered,
    msFormatQuote,
    msFormatQuoteOff,
    msMediaLink,
    msMoreHoriz,
    msMoreVert,
    msPhotoLibrary,
    msReport,
    msSatellite,
    msSentimentSatisfied,
    msStrikethroughS,
    msSubscript,
    msSuperscript,
    msVideoLibrary,
};

export type MaterialSymbol = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

interface IconProps {
    icon: MaterialSymbol;
    fill?: string;
    className?: string;
    height?: number | string;
    width?: number | string;
}

export const Icon = ({icon, fill, className, height, width}: IconProps) =>
    React.createElement(icon, {fill: fill ?? "currentColor", className, height: height ?? 24, width: width ?? 24});
