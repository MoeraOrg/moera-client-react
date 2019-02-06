import React from 'react';

import ErrorPane from "error/ErrorPane";
import LogoBar from "logobar/LogoBar";
import MainMenu from "mainmenu/MainMenu";
import Profile from "profile/Profile";
import MessageBox from "messagebox/MessageBox";
import "./App.css";

const App = () => (
    <>
        <ErrorPane />
        <LogoBar />
        <MainMenu />
        <Profile />
        <MessageBox />
    </>
);

export default App;
