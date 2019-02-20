import React from 'react';

import Storage from "storage/Storage";
import ErrorPane from "error/ErrorPane";
import LogoBar from "logobar/LogoBar";
import MainMenu from "mainmenu/MainMenu";
import ProfilePage from "profile/ProfilePage";
import MessageBox from "messagebox/MessageBox";
import "./App.css";

const App = () => (
    <>
    <Storage />
        <ErrorPane />
        <LogoBar />
        <MainMenu />
        <ProfilePage />
        <MessageBox />
    </>
);

export default App;
