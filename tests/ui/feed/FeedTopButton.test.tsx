import { renderToStaticMarkup } from 'react-dom/server';

import FeedTopButton from "ui/feed/FeedTopButton";

jest.mock("ui/hook", () => ({useDispatcher: () => jest.fn()}));
jest.mock("react-i18next", () => ({
    useTranslation: () => ({t: (key: string, options?: {count: number}) =>
        options ? `${key}:${options.count}` : key
    })
}));

test("the Explore Top button shows the total above without an unread count", () => {
    const button = renderToStaticMarkup(
        <FeedTopButton
            nodeName="alice"
            feedName="explore"
            atTop={false}
            totalAfterTop={5}
            notViewed={5}
            notViewedMoment={300}
            momentAbove={200}
        />
    );

    expect(button).not.toContain("count-new-on-posts");
    expect(button).toContain("count-more:5");
});
