import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import StoryDate from "ui/story/StoryDate";

jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key: string) => key, i18n: {language: "en"}})}));
jest.mock("state/settings/selectors", () => ({getSetting: () => false}));
jest.mock("ui/navigation/Jump", () => () => null);

const store = createStore(() => ({}));
const publishedAt = new Date("2024-05-12T20:00:00").getTime() / 1000;

afterEach(() => {
    jest.useRealTimers();
});

test.each([
    ["2024-08-12T00:00:00", "3 months ago"],
    ["2025-05-11T23:59:59", "11 months ago"],
    ["2025-05-12T00:00:00", "1 year ago"]
])("at %s the posting age badge reads %s", (now: string, expected: string) => {
    jest.useFakeTimers({now: new Date(now)});
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
        <Provider store={store}><StoryDate publishedAt={publishedAt} noteOld/></Provider>
    );
    expect(container.querySelector(".note-old")?.textContent).toBe(expected);
});
