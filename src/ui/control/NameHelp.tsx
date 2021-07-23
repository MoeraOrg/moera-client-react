import React from 'react';

export const NameHelp = () => (
    <div className="dialog-help">
        The name must be 4 - 120 characters long. You may use any Unicode character (including
        non-Latin alphabets), except whitespace and punctuation. Only this punctuation is allowed:
        {" "}<b>!</b> <b>%</b> <b>&</b> <b>*</b> <b>-</b> <b>.</b> <b>?</b>
    </div>
);
