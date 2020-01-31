import React from 'react';
import { connect as connectFormik } from 'formik';

import "./ComposeFormattingHelp.css";

const ComposeFormattingHelp = ({formik}) => (
    formik.values.bodyFormat === "markdown" ?
        (formik.values.bodyFormatShowHelp ?
            <div className="formatting-help">
                <button type="button" className="close"
                        onClick={() => formik.setFieldValue("bodyFormatShowHelp", false)}>
                    &times;
                </button>
                <b>Markdown:</b>{" "}
                <code>**bold** _italic_ [link](http://en.wikipedia.org) ![image](https://site.com/img.jpg)</code><br/>
                See Markdown <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">cheatsheet</a>
                {" or "}<a href="https://www.markdowntutorial.com/">tutorial</a> to see how to do more.
                See also <a href="https://www.webfx.com/tools/emoji-cheat-sheet/">emoji cheatsheet</a>.
            </div>
        :
            <div className="formatting-help-show"
                 onClick={() => formik.setFieldValue("bodyFormatShowHelp", true)}>
                Show formatting hint
            </div>
        ) : null
);

export default connectFormik(ComposeFormattingHelp);
