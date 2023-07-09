import { AskDialogState } from "state/askdialog/state";
import { BlockDialogState } from "state/blockdialog/state";
import { BlockingDetailsDialogState } from "state/blockingdetailsdialog/state";
import { CartesState } from "state/cartes/state";
import { ChangeDateDialogState } from "state/changedatedialog/state";
import { ComplainsState } from "state/complains/state";
import { ComposeState } from "state/compose/state";
import { ConfirmBoxState } from "state/confirmbox/state";
import { ConnectDialogState } from "state/connectdialog/state";
import { ContactsState } from "state/contacts/state";
import { DetailedPostingState } from "state/detailedposting/state";
import { DonateDialogState } from "state/donatedialog/state";
import { EntryCopyTextDialogState } from "state/entrycopytextdialog/state";
import { ErrorState } from "state/error/state";
import { FeedsState } from "state/feeds/state";
import { HomeState } from "state/home/state";
import { FlashBoxState } from "state/flashbox/state";
import { FriendGroupsDialogState } from "state/friendgroupsdialog/state";
import { ImageEditDialogState } from "state/imageeditdialog/state";
import { LightBoxState } from "state/lightbox/state";
import { LinkPreviewsState } from "state/linkpreviews/state";
import { MessageBoxState } from "state/messagebox/state";
import { NamingState } from "state/naming/state";
import { NavigationState } from "state/navigation/state";
import { NodeState } from "state/node/state";
import { NodeCardsState } from "state/nodecards/state";
import { NodeNameState } from "state/nodename/state";
import { PeopleState } from "state/people/state";
import { PeopleHideDialogState } from "state/peoplehidedialog/state";
import { PostingReplyState } from "state/postingreply/state";
import { PostingsState } from "state/postings/state";
import { ProfileState } from "state/profile/state";
import { ProgressBoxState } from "state/progressbox/state";
import { PulseState } from "state/pulse/state";
import { QuickTipsState } from "state/quicktips/state";
import { ReactionsDialogState } from "state/reactionsdialog/state";
import { RefreshState } from "state/refresh/state";
import { SettingsState } from "state/settings/state";
import { ShareDialogState } from "state/sharedialog/state";
import { SheriffOrderDialogState } from "state/sherifforderdialog/state";
import { SheriffOrderDetailsDialogState } from "state/sherifforderdetailsdialog/state";
import { SignUpDialogState } from "state/signupdialog/state";
import { SourceDialogState } from "state/sourcedialog/state";
import { TokensState } from "state/tokens/state";
import { FriendGroupAddDialogState } from "state/friendgroupadddialog/state";

export interface ClientState {
    askDialog: AskDialogState;
    blockDialog: BlockDialogState;
    blockingDetailsDialog: BlockingDetailsDialogState;
    cartes: CartesState;
    changeDateDialog: ChangeDateDialogState;
    complains: ComplainsState;
    compose: ComposeState;
    confirmBox: ConfirmBoxState;
    connectDialog: ConnectDialogState;
    contacts: ContactsState;
    detailedPosting: DetailedPostingState;
    donateDialog: DonateDialogState;
    entryCopyTextDialog: EntryCopyTextDialogState;
    error: ErrorState;
    feeds: FeedsState;
    flashBox: FlashBoxState;
    friendGroupAddDialog: FriendGroupAddDialogState;
    friendGroupsDialog: FriendGroupsDialogState;
    home: HomeState;
    imageEditDialog: ImageEditDialogState;
    lightBox: LightBoxState;
    linkPreviews: LinkPreviewsState;
    messageBox: MessageBoxState;
    naming: NamingState;
    navigation: NavigationState;
    node: NodeState;
    nodeCards: NodeCardsState;
    nodeName: NodeNameState;
    people: PeopleState;
    peopleHideDialog: PeopleHideDialogState;
    postingReply: PostingReplyState;
    postings: PostingsState;
    profile: ProfileState;
    progressBox: ProgressBoxState;
    pulse: PulseState;
    quickTips: QuickTipsState;
    reactionsDialog: ReactionsDialogState;
    refresh: RefreshState;
    settings: SettingsState;
    shareDialog: ShareDialogState;
    sheriffOrderDialog: SheriffOrderDialogState;
    sheriffOrderDetailsDialog: SheriffOrderDetailsDialogState;
    signUpDialog: SignUpDialogState;
    sourceDialog: SourceDialogState;
    tokens: TokensState;
}
