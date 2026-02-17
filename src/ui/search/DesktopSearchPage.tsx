import React from 'react';
import { useSelector } from 'react-redux';

import { isSearchInBlogAvailable } from "state/search/selectors";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import SearchTabs from "ui/search/SearchTabs";
import SearchFeed from "ui/search/SearchFeed";
import ProfileSidebar from "ui/profile/ProfileSidebar";

export default function DesktopSearchPage() {
    const searchInBlog = useSelector(isSearchInBlogAvailable);

    return (
        <Page className="search-page tabbed-page">
            <div className="page-left-pane">
                {searchInBlog ?
                    <ProfileSidebar/>
                :
                    <MainMenuSidebar/>
                }
            </div>
            <main className="page-central-pane">
                <BackBox>
                    <BackBoxInner>
                        <SearchTabs/>
                    </BackBoxInner>
                </BackBox>
                <SearchFeed/>
            </main>
            {searchInBlog &&
                <div className="page-right-pane">
                    <MainMenuSidebar/>
                </div>
            }
        </Page>
    );
}
