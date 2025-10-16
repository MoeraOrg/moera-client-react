import { DraftText, Node, NodeName, PostingInfo, PrincipalValue, SourceFormat } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { PostingReplyAction, postingReplyFailed } from "state/postingreply/actions";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { getNodeUri } from "state/naming/sagas";
import { goToLocation, initFromLocation } from "state/navigation/actions";
import { getHomeOwnerName, getHomeRootLocation, getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { executor } from "state/executor";
import { htmlToMarkdown } from "ui/control/richtexteditor/markdown/markdown-html";
import { getWindowSelectionHtml } from "util/ui";
import { mentionName } from "util/names";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { htmlEntities } from "util/html";
import { universalLocation } from "util/universal-url";

export default [
    executor("POSTING_REPLY", "", postingReplySaga)
];

async function postingReplySaga(action: WithContext<PostingReplyAction>): Promise<void> {
    const {
        posting, nodeRootPage, homeOwnerName, homeRootPage, homeRootLocation, subjectPrefix, preambleTemplate,
        preambleTemplateHtml, quoteAll, visibilityDefault, sourceFormatDefault, commentsVisibilityDefault,
        commentAdditionDefault, reactionsEnabledDefault, reactionsNegativeEnabledDefault, reactionsPositiveDefault,
        reactionsNegativeDefault, reactionsVisibleDefault, reactionTotalsVisibleDefault
    } = select(state => ({
            posting: getPosting(state, state.postingReply.postingId, REL_CURRENT),
            nodeRootPage: getNodeRootPage(state),
            homeOwnerName: getHomeOwnerName(state),
            homeRootPage: getHomeRootPage(state),
            homeRootLocation: getHomeRootLocation(state),
            subjectPrefix: getSetting(state, "posting.reply.subject-prefix") as string,
            preambleTemplate: getSetting(state, "posting.reply.preamble") as string,
            preambleTemplateHtml: getSetting(state, "posting.reply.preamble-html") as string,
            quoteAll: getSetting(state, "posting.reply.quote-all") as boolean,
            visibilityDefault: getSetting(state, "posting.visibility.default") as PrincipalValue,
            sourceFormatDefault: getSetting(state, "posting.body-src-format.default") as SourceFormat,
            commentsVisibilityDefault: getSetting(state, "posting.comments.visibility.default") as PrincipalValue,
            commentAdditionDefault: getSetting(state, "posting.comments.addition.default") as PrincipalValue,
            reactionsEnabledDefault: getSetting(state, "posting.reactions.enabled.default") as boolean,
            reactionsNegativeEnabledDefault: getSetting(state, "posting.reactions.negative.enabled.default") as boolean,
            reactionsPositiveDefault: getSetting(state, "posting.reactions-disabled.positive.default") as string,
            reactionsNegativeDefault: getSetting(state, "posting.reactions-disabled.negative.default") as string,
            reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default") as boolean,
            reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default") as boolean
        }));
    if (posting == null || homeOwnerName == null || nodeRootPage == null) {
        return;
    }
    try {
        const subject = replySubject(posting.body.subject, subjectPrefix);

        let html: string | null | undefined = getWindowSelectionHtml();
        if (!html && quoteAll) {
            html = posting.body.text?.trim();
        }
        let text: string;
        switch (sourceFormatDefault) {
            case "html":
            case "html/visual": {
                const name = posting.ownerFullName || NodeName.shorten(posting.ownerName);
                const href = universalLocation(null, posting.ownerName, null, "/");
                const mention =
                    `<a href="${htmlEntities(href)}" data-nodename="${htmlEntities(posting.ownerName)}" data-href="/">`
                    + `${htmlEntities(name)}</a>`;
                const preamble = preambleTemplateHtml
                    .replace("%POST%", await postingHref(action, posting, nodeRootPage))
                    .replace("%USER%", mention);
                if (sourceFormatDefault === "html/visual") {
                    text = html ? `<p>${preamble}</p><blockquote>${html}</blockquote>` : `<p>${preamble}</p>`
                } else {
                    text = html ? `${preamble}\n\n<blockquote>${html}</blockquote>\n\n` : `${preamble}\n\n`
                }
                break;
            }
            default:
            case "plain-text":
            case "markdown": {
                const preamble = preambleTemplate
                    .replace("%POST%", await postingHref(action, posting, nodeRootPage))
                    .replace("%USER%", mentionName(posting.ownerName, posting.ownerFullName));
                text = htmlToMarkdown(html) ?? "";
                text = text ? `${preamble}\n>>>\n${text}\n>>>\n` : `${preamble}\n`
                break;
            }
        }

        const draftText: DraftText = {
            draftType: "new-posting",
            receiverName: homeOwnerName,
            bodySrc: JSON.stringify({subject, text}),
            bodySrcFormat: sourceFormatDefault,
            rejectedReactions: {
                positive: reactionsPositiveDefault,
                negative: reactionsNegativeDefault
            },
            operations: {
                view: visibilityDefault,
                viewComments: commentsVisibilityDefault,
                addComment: commentAdditionDefault,
                viewReactions: reactionsVisibleDefault ? "public" : "private",
                viewNegativeReactions: reactionsVisibleDefault ? "public" : "private",
                viewReactionTotals: reactionTotalsVisibleDefault ? "public" : "private",
                viewNegativeReactionTotals: reactionTotalsVisibleDefault ? "public" : "private",
                viewReactionRatios: "public",
                viewNegativeReactionRatios: "public",
                addReaction: reactionsEnabledDefault ? "public" : "none",
                addNegativeReaction: reactionsNegativeEnabledDefault ? "public" : "none"
            }
        };
        const draft = await Node.createDraft(action, REL_HOME, draftText);
        if (nodeRootPage !== homeRootPage) {
            if (homeRootLocation != null) {
                dispatch(initFromLocation(
                    homeOwnerName, homeRootLocation, "/compose", `?draft=${draft.id}`, null
                ).causedBy(action))
            }
        } else {
            dispatch(goToLocation("/compose", `?draft=${draft.id}`, null).causedBy(action))
        }
    } catch (e) {
        dispatch(postingReplyFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

function replySubject(subject?: string | null, subjectPrefix?: string | null): string | null | undefined {
    if (!subject || !subjectPrefix) {
        return subject;
    }
    if (!subject.startsWith(subjectPrefix)) {
        return subjectPrefix + " " + subject;
    }
    const tail = subject.substring(subjectPrefix.length);
    const m = tail.match(/^\s*\[(\d+)]\s+(.*)$/);
    if (m == null) {
        return subjectPrefix + "[2]" + tail;
    }
    return subjectPrefix + "[" + (parseInt(m[1]) + 1) + "] " + m[2];
}

async function postingHref(action: PostingReplyAction, posting: PostingInfo, rootNodePage: string): Promise<string> {
    if (posting.receiverName == null) {
        return `${rootNodePage}/post/${posting.id}`;
    } else {
        const rootReceiverPage = await getNodeUri(action, posting.receiverName);
        return `${rootReceiverPage}/post/${posting.receiverPostingId}`;
    }
}
