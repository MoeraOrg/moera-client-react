import React from 'react';

import ErrorPane from "error/ErrorPane";
import LogoBar from "logobar/LogoBar";
import MainMenu from "mainmenu/MainMenu";
import Profile from "profile/Profile";
import "./App.css";

const App = () => (
    <>
        <ErrorPane />
        <LogoBar />
        <MainMenu />
        <Profile />

        <div id="modal-root" />
    </>
);

export default App;
