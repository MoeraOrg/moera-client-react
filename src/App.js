import React from 'react';

import ErrorPane from "error/ErrorPane";
import MainMenu from "mainmenu/MainMenu";
import "./App.css";

const App = () => (
    <>
        <ErrorPane/>
        <div className="logobar"><img src="/pics/logo-w-64.png" alt="Moera" /></div>
        <MainMenu />
    </>
);

export default App;
