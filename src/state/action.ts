import { AskDialogAnyAction } from "state/askdialog/actions";
import { CartesAnyAction } from "state/cartes/actions";
import { ChangeDateDialogAnyAction } from "state/changedatedialog/actions";
import { ComposeAnyAction } from "state/compose/actions";
import { ConfirmBoxAnyAction } from "state/confirmbox/actions";
import { ConnectDialogAnyAction } from "state/connectdialog/actions";
import { ContactsAnyAction } from "state/contacts/actions";
import { DetailedPostingAnyAction } from "state/detailedposting/actions";
import { DonateDialogAnyAction } from "state/donatedialog/actions";
import { EntryCopyTextDialogAnyAction } from "state/entrycopytextdialog/actions";
import { ErrorAnyAction } from "state/error/actions";
import { FeedsAnyAction } from "state/feeds/actions";
import { FlashBoxAnyAction } from "state/flashbox/actions";
import { FriendGroupsDialogAnyAction } from "state/friendgroupsdialog/actions";
import { HomeAnyAction } from "state/home/actions";
import { ImageEditDialogAnyAction } from "state/imageeditdialog/actions";
import { LightBoxAnyAction } from "state/lightbox/actions";
import { LinkPreviewsAnyAction } from "state/linkpreviews/actions";
import { MessageBoxAnyAction } from "state/messagebox/actions";
import { NamingAnyAction } from "state/naming/actions";
import { NavigationAnyAction } from "state/navigation/actions";
import { NodeAnyAction } from "state/node/actions";
import { NodeCardsAnyAction } from "state/nodecards/actions";
import { NodeNameAnyAction } from "state/nodename/actions";
import { PeopleAnyAction } from "state/people/actions";
import { PeopleHideDialogAnyAction } from "state/peoplehidedialog/actions";
import { PostingReplyAnyAction } from "state/postingreply/actions";
import { PostingsAnyAction } from "state/postings/actions";
import { ProfileAnyAction } from "state/profile/actions";
import { PulseAnyAction } from "state/pulse/actions";
import { QuickTipsAnyAction } from "state/quicktips/actions";
import { ReactionsDialogAnyAction } from "state/reactionsdialog/actions";
import { RefreshAnyAction } from "state/refresh/actions";
import { RichTextEditorAnyAction } from "state/richtexteditor/actions";
import { SettingsAnyAction } from "state/settings/actions";
import { ShareDialogAnyAction } from "state/sharedialog/actions";
import { SignUpDialogAnyAction } from "state/signupdialog/actions";
import { SourceDialogAnyAction } from "state/sourcedialog/actions";
import { StoriesAnyAction } from "state/stories/actions";
import { ClientEventAction } from "api/events/actions";

export type ClientAction =
    ClientEventAction
    | AskDialogAnyAction
    | CartesAnyAction
    | ChangeDateDialogAnyAction
    | ComposeAnyAction
    | ConfirmBoxAnyAction
    | ConnectDialogAnyAction
    | ContactsAnyAction
    | DonateDialogAnyAction
    | DetailedPostingAnyAction
    | EntryCopyTextDialogAnyAction
    | ErrorAnyAction
    | FeedsAnyAction
    | FlashBoxAnyAction
    | FriendGroupsDialogAnyAction
    | HomeAnyAction
    | ImageEditDialogAnyAction
    | LightBoxAnyAction
    | LinkPreviewsAnyAction
    | MessageBoxAnyAction
    | NamingAnyAction
    | NavigationAnyAction
    | NodeAnyAction
    | NodeCardsAnyAction
    | NodeNameAnyAction
    | PeopleAnyAction
    | PeopleHideDialogAnyAction
    | PostingReplyAnyAction
    | PostingsAnyAction
    | ProfileAnyAction
    | PulseAnyAction
    | QuickTipsAnyAction
    | ReactionsDialogAnyAction
    | RefreshAnyAction
    | RichTextEditorAnyAction
    | SettingsAnyAction
    | ShareDialogAnyAction
    | SignUpDialogAnyAction
    | SourceDialogAnyAction
    | StoriesAnyAction;

export type ClientActionType = ClientAction["type"];
