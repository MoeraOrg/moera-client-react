import React from 'react';

import "./PageHeader.css";

const PageHeader = ({children}) => (
    <div id="page-header">
        <div className="panel">
            {children}
        </div>
    </div>
);

export default PageHeader;
