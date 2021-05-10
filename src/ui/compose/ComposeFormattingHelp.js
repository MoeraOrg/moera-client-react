import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useField } from 'formik';

import { ClientSettings } from "api";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import "./ComposeFormattingHelp.css";

function ComposeFormattingHelp({show, settingsUpdate}) {
    const [visible, setVisible] = useState(show);

    const toggleHelp = show => {
        setVisible(show);
        settingsUpdate([{
            name: ClientSettings.PREFIX + "posting.body-src-format.show-help",
            value: show.toString()
        }]);
    };

    const showHelp = () => toggleHelp(true);

    const hideHelp = () => toggleHelp(false);

    useEffect(
        () => setVisible(show),
        [show, setVisible]
    );

    const [, {value: bodyFormat}] = useField("bodyFormat");
    if (bodyFormat !== "markdown") {
        return null;
    }

    if (visible) {
        return (
            <div className="dialog-help">
                <button type="button" className="close" onClick={hideHelp}>&times;</button>
                <b>Markdown:</b> see{" "}
                <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">cheatsheet</a>
                {" or "}<a href="https://www.markdowntutorial.com/">tutorial</a> to see how to do more.
                See also <a href="https://www.webfx.com/tools/emoji-cheat-sheet/">emoji cheatsheet</a>.
            </div>
        );
    } else {
        return (
            <div className="formatting-help-show" onClick={showHelp}>Show formatting hint</div>
        );
    }
}

export default connect(
    state => ({
        show: getSetting(state, "posting.body-src-format.show-help")
    }),
    { settingsUpdate }
)(ComposeFormattingHelp);
