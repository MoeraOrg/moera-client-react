import React from 'react';

import ErrorPane from "error/ErrorPane";
import MainMenu from "mainmenu/MainMenu";
import Profile from "profile/Profile";
import "./App.css";

const App = () => (
    <>
        <ErrorPane/>
        <div className="logo-bar"><img src="/pics/logo-w-64.png" alt="Moera" /></div>
        <MainMenu />
        <Profile/>
    </>
);

export default App;
