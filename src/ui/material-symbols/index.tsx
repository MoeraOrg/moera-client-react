import * as React from 'react';

import { ReactComponent as msAddBox } from "ui/material-symbols/add_box.isvg";
import { ReactComponent as msAddLink } from "ui/material-symbols/add_link.isvg";
import { ReactComponent as msAlternateEmail } from "ui/material-symbols/alternate_email.isvg";
import { ReactComponent as msArrowDownward } from "ui/material-symbols/arrow_downward.isvg";
import { ReactComponent as msArrowSelectorToolFilled } from "ui/material-symbols/arrow_selector_tool_filled.isvg";
import { ReactComponent as msArrowUpward } from "ui/material-symbols/arrow_upward.isvg";
import { ReactComponent as msBackspaceFilled16 } from "ui/material-symbols/backspace_filled16.isvg";
import { ReactComponent as msBadge } from "ui/material-symbols/badge.isvg";
import { ReactComponent as msBlock } from "ui/material-symbols/block.isvg";
import { ReactComponent as msCalendarMonth } from "ui/material-symbols/calendar_month.isvg";
import { ReactComponent as msCancel } from "ui/material-symbols/cancel.isvg";
import { ReactComponent as msCheck } from "ui/material-symbols/check.isvg";
import { ReactComponent as msChevronRight } from "ui/material-symbols/chevron_right.isvg";
import { ReactComponent as msCircleFilled } from "ui/material-symbols/circle_filled.isvg";
import { ReactComponent as msClose } from "ui/material-symbols/close.isvg";
import { ReactComponent as msClose12 } from "ui/material-symbols/close12.isvg";
import { ReactComponent as msCloudDone } from "ui/material-symbols/cloud_done.isvg";
import { ReactComponent as msCloudUpload } from "ui/material-symbols/cloud_upload.isvg";
import { ReactComponent as msCode } from "ui/material-symbols/code.isvg";
import { ReactComponent as msCodeBlocks } from "ui/material-symbols/code_blocks.isvg";
import { ReactComponent as msComment } from "ui/material-symbols/comment.isvg";
import { ReactComponent as msCommentRegular } from "ui/material-symbols/comment-regular.isvg"; // FontAwesome
import { ReactComponent as msDelete } from "ui/material-symbols/delete.isvg";
import { ReactComponent as msError } from "ui/material-symbols/error.isvg";
import { ReactComponent as msExpandCircleDown } from "ui/material-symbols/expand_circle_down.isvg";
import { ReactComponent as msExpandCircleDownFilled40 } from "ui/material-symbols/expand_circle_down_filled40.isvg";
import { ReactComponent as msExpandCircleUpFilled40 } from "ui/material-symbols/expand_circle_up_filled40.isvg";
import { ReactComponent as msFileSave } from "ui/material-symbols/file_save.isvg";
import { ReactComponent as msFormatBold } from "ui/material-symbols/format_bold.isvg";
import { ReactComponent as msFormatClear } from "ui/material-symbols/format_clear.isvg";
import { ReactComponent as msFormatH1 } from "ui/material-symbols/format_h1.isvg";
import { ReactComponent as msFormatH2 } from "ui/material-symbols/format_h2.isvg";
import { ReactComponent as msFormatH3 } from "ui/material-symbols/format_h3.isvg";
import { ReactComponent as msFormatH4 } from "ui/material-symbols/format_h4.isvg";
import { ReactComponent as msFormatH5 } from "ui/material-symbols/format_h5.isvg";
import { ReactComponent as msFormatIndentDecrease } from "ui/material-symbols/format_indent_decrease.isvg";
import { ReactComponent as msFormatIndentIncrease } from "ui/material-symbols/format_indent_increase.isvg";
import { ReactComponent as msFormatInkHighlighter } from "ui/material-symbols/format_ink_highlighter.isvg";
import { ReactComponent as msFormatItalic } from "ui/material-symbols/format_italic.isvg";
import { ReactComponent as msFormatListBulleted } from "ui/material-symbols/format_list_bulleted.isvg";
import { ReactComponent as msFormatListNumbered } from "ui/material-symbols/format_list_numbered.isvg";
import { ReactComponent as msFormatQuote } from "ui/material-symbols/format_quote.isvg";
import { ReactComponent as msFormatQuoteOff } from "ui/material-symbols/format_quote_off.isvg";
import { ReactComponent as msFormatSize } from "ui/material-symbols/format_size.isvg";
import { ReactComponent as msFunction } from "ui/material-symbols/function.isvg";
import { ReactComponent as msGroup } from "ui/material-symbols/group.isvg";
import { ReactComponent as msGroupAdd } from "ui/material-symbols/group_add.isvg";
import { ReactComponent as msGroupOff } from "ui/material-symbols/group_off.isvg";
import { ReactComponent as msGroups } from "ui/material-symbols/groups.isvg";
import { ReactComponent as msHelpFilled40 } from "ui/material-symbols/help_filled40.isvg";
import { ReactComponent as msHistory } from "ui/material-symbols/history.isvg";
import { ReactComponent as msHorizontalRule } from "ui/material-symbols/horizontal_rule.isvg";
import { ReactComponent as msInkPen } from "ui/material-symbols/ink_pen.isvg";
import { ReactComponent as msKeepFilled16 } from "ui/material-symbols/keep_filled16.isvg";
import { ReactComponent as msKeyboardArrowDown } from "ui/material-symbols/keyboard_arrow_down.isvg";
import { ReactComponent as msKeyboardArrowRight } from "ui/material-symbols/keyboard_arrow_right.isvg";
import { ReactComponent as msKeyboardArrowUp } from "ui/material-symbols/keyboard_arrow_up.isvg";
import { ReactComponent as msLink } from "ui/material-symbols/link.isvg";
import { ReactComponent as msLiveHelp } from "ui/material-symbols/live_help.isvg";
import { ReactComponent as msLock } from "ui/material-symbols/lock.isvg";
import { ReactComponent as msMediaLink } from "ui/material-symbols/media_link.isvg";
import { ReactComponent as msMoreHoriz } from "ui/material-symbols/more_horiz.isvg";
import { ReactComponent as msMoreVert } from "ui/material-symbols/more_vert.isvg";
import { ReactComponent as msMoreVert12 } from "ui/material-symbols/more_vert12.isvg";
import { ReactComponent as msOpenInNew } from "ui/material-symbols/open_in_new.isvg";
import { ReactComponent as msPartlyCloudyDay } from "ui/material-symbols/partly_cloudy_day.isvg";
import { ReactComponent as msPerson } from "ui/material-symbols/person.isvg";
import { ReactComponent as msPersonBook } from "ui/material-symbols/person_book.isvg";
import { ReactComponent as msPersonCancel } from "ui/material-symbols/person_cancel.isvg";
import { ReactComponent as msPersonCheck } from "ui/material-symbols/person_check.isvg";
import { ReactComponent as msPersonOff } from "ui/material-symbols/person_off.isvg";
import { ReactComponent as msPersonSearch } from "ui/material-symbols/person_search.isvg";
import { ReactComponent as msPhotoLibrary } from "ui/material-symbols/photo_library.isvg";
import { ReactComponent as msPreview } from "ui/material-symbols/preview.isvg";
import { ReactComponent as msPublic } from "ui/material-symbols/public.isvg";
import { ReactComponent as msRedo } from "ui/material-symbols/redo.isvg";
import { ReactComponent as msRepeat } from "ui/material-symbols/repeat.isvg";
import { ReactComponent as msReplySolid } from "ui/material-symbols/reply-solid.isvg"; // FontAwesome
import { ReactComponent as msReport } from "ui/material-symbols/report.isvg";
import { ReactComponent as msRestartAlt16 } from "ui/material-symbols/restart_alt16.isvg";
import { ReactComponent as msSatellite } from "ui/material-symbols/satellite.isvg";
import { ReactComponent as msSearch } from "ui/material-symbols/search.isvg";
import { ReactComponent as msSend } from "ui/material-symbols/send.isvg";
import { ReactComponent as msSentimentSatisfied } from "ui/material-symbols/sentiment_satisfied.isvg";
import { ReactComponent as msSchedule } from "ui/material-symbols/schedule.isvg";
import { ReactComponent as msShare } from "ui/material-symbols/share.isvg";
import { ReactComponent as msShieldPerson } from "ui/material-symbols/shield_person.isvg";
import { ReactComponent as msSort } from "ui/material-symbols/sort.isvg";
import { ReactComponent as msSortByAlpha } from "ui/material-symbols/sort_by_alpha.isvg";
import { ReactComponent as msStarFilled16 } from "ui/material-symbols/star_filled16.isvg";
import { ReactComponent as msStrikethroughS } from "ui/material-symbols/strikethrough_s.isvg";
import { ReactComponent as msSubscript } from "ui/material-symbols/subscript.isvg";
import { ReactComponent as msSuperscript } from "ui/material-symbols/superscript.isvg";
import { ReactComponent as msThumbDown } from "ui/material-symbols/thumb_down.isvg";
import { ReactComponent as msThumbUp } from "ui/material-symbols/thumb_up.isvg";
import { ReactComponent as msThumbsDownSolid } from "ui/material-symbols/thumbs-down-solid.isvg"; // FontAwesome
import { ReactComponent as msThumbsUpSolid } from "ui/material-symbols/thumbs-up-solid.isvg"; // FontAwesome
import { ReactComponent as msTitle } from "ui/material-symbols/title.isvg";
import { ReactComponent as msTune } from "ui/material-symbols/tune.isvg";
import { ReactComponent as msUndo } from "ui/material-symbols/undo.isvg";
import { ReactComponent as msVerifiedUser } from "ui/material-symbols/verified_user.isvg";
import { ReactComponent as msVideoLibrary } from "ui/material-symbols/video_library.isvg";
import { ReactComponent as msVisibility } from "ui/material-symbols/visibility.isvg";
import { ReactComponent as msVisibilityOff } from "ui/material-symbols/visibility_off.isvg";
import { ReactComponent as msVolunteerActivism } from "ui/material-symbols/volunteer_activism.isvg";

export {
    msAddBox,
    msAddLink,
    msAlternateEmail,
    msArrowDownward,
    msArrowSelectorToolFilled,
    msArrowUpward,
    msBackspaceFilled16,
    msBadge,
    msBlock,
    msCalendarMonth,
    msCancel,
    msCheck,
    msChevronRight,
    msCircleFilled,
    msClose,
    msClose12,
    msCloudDone,
    msCloudUpload,
    msCode,
    msCodeBlocks,
    msComment,
    msCommentRegular,
    msDelete,
    msError,
    msExpandCircleDown,
    msExpandCircleDownFilled40,
    msExpandCircleUpFilled40,
    msFileSave,
    msFormatBold,
    msFormatClear,
    msFormatH1,
    msFormatH2,
    msFormatH3,
    msFormatH4,
    msFormatH5,
    msFormatIndentDecrease,
    msFormatIndentIncrease,
    msFormatInkHighlighter,
    msFormatItalic,
    msFormatListBulleted,
    msFormatListNumbered,
    msFormatQuote,
    msFormatQuoteOff,
    msFormatSize,
    msFunction,
    msGroup,
    msGroupAdd,
    msGroupOff,
    msGroups,
    msHelpFilled40,
    msHistory,
    msHorizontalRule,
    msInkPen,
    msKeepFilled16,
    msLink,
    msLiveHelp,
    msLock,
    msKeyboardArrowDown,
    msKeyboardArrowRight,
    msKeyboardArrowUp,
    msMediaLink,
    msMoreHoriz,
    msMoreVert,
    msMoreVert12,
    msOpenInNew,
    msPartlyCloudyDay,
    msPerson,
    msPersonBook,
    msPersonCancel,
    msPersonCheck,
    msPersonOff,
    msPersonSearch,
    msPhotoLibrary,
    msPreview,
    msPublic,
    msRedo,
    msRepeat,
    msReplySolid,
    msReport,
    msRestartAlt16,
    msSatellite,
    msSearch,
    msSend,
    msSentimentSatisfied,
    msShare,
    msSchedule,
    msShieldPerson,
    msSort,
    msSortByAlpha,
    msStarFilled16,
    msStrikethroughS,
    msSubscript,
    msSuperscript,
    msThumbDown,
    msThumbUp,
    msThumbsDownSolid,
    msThumbsUpSolid,
    msTitle,
    msTune,
    msUndo,
    msVerifiedUser,
    msVideoLibrary,
    msVisibility,
    msVisibilityOff,
    msVolunteerActivism,
};

export type MaterialSymbol = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

interface IconProps {
    icon: MaterialSymbol;
    fill?: string;
    className?: string;
    size?: number | string;
    title?: string;
}

export const Icon = ({icon, fill, className, size, title}: IconProps) =>
    React.createElement(icon, {fill: fill ?? "currentColor", className, height: size ?? 24, width: size ?? 24, title});
