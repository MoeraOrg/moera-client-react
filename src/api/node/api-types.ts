// This file is generated

export type PrincipalValue = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "unset" | string;

export type AskSubject = "subscribe" | "friend";

export type BlockedEntryOperation = "addComment" | "addReaction";

export type BlockedOperation = "reaction" | "comment" | "posting" | "visibility" | "instant";

export type BodyFormat = "message" | "application";

export type DraftType = "new-posting" | "posting-update" | "new-comment" | "comment-update";

export type OperationStatus = "waiting" | "added" | "started" | "succeeded" | "failed" | "unknown";

export type PrincipalFlag = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "friends" | "unset";

export type PushContentType = "story-added" | "story-deleted" | "feed-updated";

export type PushRelayType = "fcm";

export type Scope = "none" | "identify" | "other" | "view-media" | "view-content" | "add-post" | "update-post"
    | "add-comment" | "update-comment" | "react" | "delete-own-content" | "delete-others-content" | "view-people"
    | "block" | "friend" | "remote-identify" | "drafts" | "view-feeds" | "update-feeds" | "name" | "plugins"
    | "view-profile" | "update-profile" | "sheriff" | "view-settings" | "update-settings" | "subscribe" | "tokens"
    | "user-lists" | "grant" | "upload-public-media" | "upload-private-media" | "view-all" | "all";

export type SearchEngine = "google";

export type SettingType = "bool" | "int" | "string" | "json" | "Duration" | "PrivateKey" | "PublicKey" | "Timestamp"
    | "UUID" | "Principal";

export type SheriffComplaintStatus = "posted" | "prepared" | "prepare-failed" | "not-found" | "invalid-target"
    | "not-original" | "not-sheriff" | "approved" | "rejected";

export type SheriffOrderCategory = "visibility";

export type SheriffOrderReason = "unlawful" | "defamatory" | "threat" | "spam" | "scam" | "malware" | "copyright"
    | "impersonating" | "privacy" | "other";

export type SourceFormat = "plain-text" | "html" | "markdown" | "application";

export type StoryType = "asked-to-friend" | "asked-to-subscribe" | "blocked-user" | "blocked-user-in-posting"
    | "comment-added" | "comment-media-reaction-added-negative" | "comment-media-reaction-added-positive"
    | "comment-media-reaction-failed" | "comment-post-task-failed" | "comment-reaction-added-negative"
    | "comment-reaction-added-positive" | "comment-reaction-task-failed" | "comment-update-task-failed" | "defrosting"
    | "friend-added" | "friend-deleted" | "friend-group-deleted" | "mention-comment" | "mention-posting"
    | "posting-added" | "posting-media-reaction-added-negative" | "posting-media-reaction-added-positive"
    | "posting-media-reaction-failed" | "posting-post-task-failed" | "posting-reaction-task-failed"
    | "posting-subscribe-task-failed" | "posting-update-task-failed" | "posting-updated" | "reaction-added-negative"
    | "reaction-added-positive" | "reminder-avatar" | "reminder-full-name" | "remote-comment-added" | "reply-comment"
    | "search-report" | "sheriff-complaint-added" | "sheriff-complaint-decided" | "sheriff-marked" | "sheriff-unmarked"
    | "subscriber-added" | "subscriber-deleted" | "unblocked-user" | "unblocked-user-in-posting";

export type SubscriptionReason = "user" | "mention" | "comment";

export type SubscriptionType = "feed" | "posting" | "posting-comments" | "profile" | "user-list";

export type VerificationStatus = "running" | "correct" | "incorrect" | "error";

export interface CommentOperations {
    view?: PrincipalValue | null;
    edit?: PrincipalValue | null;
    delete?: PrincipalValue | null;
    viewReactions?: PrincipalValue | null;
    viewNegativeReactions?: PrincipalValue | null;
    viewReactionTotals?: PrincipalValue | null;
    viewNegativeReactionTotals?: PrincipalValue | null;
    viewReactionRatios?: PrincipalValue | null;
    viewNegativeReactionRatios?: PrincipalValue | null;
    addReaction?: PrincipalValue | null;
    addNegativeReaction?: PrincipalValue | null;
}

export interface ContactOperations {
    viewFeedSubscriber?: PrincipalValue | null;
    viewFeedSubscription?: PrincipalValue | null;
    viewFriend?: PrincipalValue | null;
    viewFriendOf?: PrincipalValue | null;
    viewBlock?: PrincipalValue | null;
    viewBlockBy?: PrincipalValue | null;
}

export interface FeedOperations {
    add?: PrincipalValue | null;
}

export interface FriendOperations {
    view?: PrincipalValue | null;
}

export interface FriendGroupOperations {
    view?: PrincipalValue | null;
}

export interface NodeNameOperations {
    manage?: PrincipalValue | null;
}

export interface PeopleOperations {
    viewSubscribers?: PrincipalValue | null;
    viewSubscriptions?: PrincipalValue | null;
    viewFriends?: PrincipalValue | null;
    viewFriendOfs?: PrincipalValue | null;
    viewBlocked?: PrincipalValue | null;
    viewBlockedBy?: PrincipalValue | null;
    viewSubscribersTotal?: PrincipalValue | null;
    viewSubscriptionsTotal?: PrincipalValue | null;
    viewFriendsTotal?: PrincipalValue | null;
    viewFriendOfsTotal?: PrincipalValue | null;
}

export interface PostingOperations {
    view?: PrincipalValue | null;
    edit?: PrincipalValue | null;
    delete?: PrincipalValue | null;
    viewComments?: PrincipalValue | null;
    addComment?: PrincipalValue | null;
    overrideComment?: PrincipalValue | null;
    viewReactions?: PrincipalValue | null;
    viewNegativeReactions?: PrincipalValue | null;
    viewReactionTotals?: PrincipalValue | null;
    viewNegativeReactionTotals?: PrincipalValue | null;
    viewReactionRatios?: PrincipalValue | null;
    viewNegativeReactionRatios?: PrincipalValue | null;
    addReaction?: PrincipalValue | null;
    addNegativeReaction?: PrincipalValue | null;
    overrideReaction?: PrincipalValue | null;
    overrideCommentReaction?: PrincipalValue | null;
}

export interface PrivateMediaFileOperations {
    view?: PrincipalValue | null;
}

export interface ProfileOperations {
    edit?: PrincipalValue | null;
    viewEmail?: PrincipalValue | null;
}

export interface ReactionOperations {
    view?: PrincipalValue | null;
    delete?: PrincipalValue | null;
}

export interface StoryOperations {
    edit?: PrincipalValue | null;
    delete?: PrincipalValue | null;
}

export interface SubscriberOperations {
    view?: PrincipalValue | null;
    delete?: PrincipalValue | null;
}

export interface SubscriptionOperations {
    view?: PrincipalValue | null;
    delete?: PrincipalValue | null;
}

export interface AcceptedReactions {
    positive: string;
    negative: string;
}

export interface AskDescription {
    subject: AskSubject;
    friendGroupId?: string | null;
    message?: string | null;
}

export interface AsyncOperationCreated {
    id: string;
}

export interface AvatarAttributes {
    mediaId: string;
    clipX: number;
    clipY: number;
    clipSize: number;
    avatarSize: number;
    rotate: number;
    shape?: string | null;
    ordinal?: number | null;
}

export interface AvatarDescription {
    mediaId: string;
    shape: string;
    optional?: boolean | null;
}

export interface AvatarImage {
    mediaId: string;
    path: string;
    width?: number | null;
    height?: number | null;
    shape?: string | null;
}

export interface AvatarInfo {
    id: string;
    mediaId: string;
    path: string;
    width?: number | null;
    height?: number | null;
    shape?: string | null;
    ordinal: number;
}

export interface AvatarOrdinal {
    id: string;
    ordinal: number;
}

export interface AvatarsOrdered {
    ids: string[];
}

export interface BlockedInstantAttributes {
    storyType: StoryType;
    entryId?: string | null;
    remoteNodeName?: string | null;
    remotePostingId?: string | null;
    remoteOwnerName?: string | null;
    deadline?: number | null;
}

export interface BlockedInstantFilter {
    storyType: StoryType;
    entryId?: string | null;
    remoteNodeName?: string | null;
    remotePostingId?: string | null;
    remoteOwnerName?: string | null;
}

export interface BlockedInstantInfo {
    id: string;
    storyType: StoryType;
    entryId?: string | null;
    remoteNodeName?: string | null;
    remotePostingId?: string | null;
    remoteOwnerName?: string | null;
    createdAt: number;
    deadline?: number | null;
}

export interface BlockedPostingInstantInfo {
    id: string;
    storyType: StoryType;
    remoteOwnerName?: string | null;
    deadline?: number | null;
}

export interface BlockedUserAttributes {
    blockedOperation: BlockedOperation;
    nodeName: string;
    entryId?: string | null;
    entryNodeName?: string | null;
    entryPostingId?: string | null;
    deadline?: number | null;
    reasonSrc?: string | null;
    reasonSrcFormat?: SourceFormat | null;
}

export interface BlockedUserFilter {
    blockedOperations?: BlockedOperation[] | null;
    nodeName?: string | null;
    entryId?: string | null;
    entryNodeName?: string | null;
    entryPostingId?: string | null;
    strict?: boolean | null;
}

export interface BlockedUsersChecksums {
    visibility: number;
}

export interface CarteAttributes {
    clientScope?: Scope[] | null;
    adminScope?: Scope[] | null;
    nodeName?: string | null;
    limit?: number | null;
}

export interface CarteInfo {
    carte: string;
    beginning: number;
    deadline: number;
    nodeName?: string | null;
    clientScope?: Scope[] | null;
    adminScope?: Scope[] | null;
}

export interface CarteSet {
    cartesIp?: string | null;
    cartes: CarteInfo[];
    createdAt: number;
}

export interface CarteVerificationInfo {
    valid: boolean;
    clientName?: string | null;
    clientScope?: Scope[] | null;
    adminScope?: Scope[] | null;
    errorCode?: string | null;
    errorMessage?: string | null;
}

export interface ClientCarte {
    clientName?: string | null;
    carte: string;
}

export interface ClientReactionInfo {
    negative: boolean;
    emoji: number;
    createdAt: number;
    deadline?: number | null;
}

export interface CommentMassAttributes {
    seniorOperations?: CommentOperations | null;
}

export interface CommentTotalInfo {
    total: number;
}

export interface ContactInfo {
    nodeName: string;
    fullName?: string | null;
    gender?: string | null;
    avatar?: AvatarImage | null;
    closeness: number;
    hasFeedSubscriber?: boolean | null;
    hasFeedSubscription?: boolean | null;
    hasFriend?: boolean | null;
    hasFriendOf?: boolean | null;
    hasBlock?: boolean | null;
    hasBlockBy?: boolean | null;
    operations?: ContactOperations | null;
    ownerOperations?: ContactOperations | null;
    adminOperations?: ContactOperations | null;
}

export interface Credentials {
    login: string;
    password: string;
}

export interface CredentialsChange {
    token?: string | null;
    oldPassword?: string | null;
    login: string;
    password: string;
}

export interface CredentialsCreated {
    created: boolean;
}

export interface DeleteNodeStatus {
    requested: boolean;
}

export interface DeleteNodeText {
    message?: string | null;
}

export interface DomainAttributes {
    name?: string | null;
    nodeId?: string | null;
}

export interface DomainAvailable {
    name: string;
}

export interface DomainInfo {
    name: string;
    nodeId: string;
    createdAt: number;
}

export interface EmailHint {
    emailHint: string;
}

export interface FeedReference {
    feedName: string;
    publishedAt: number;
    pinned?: boolean | null;
    moment: number;
    storyId: string;
    operations?: StoryOperations | null;
}

export interface FeedStatus {
    total: number;
    totalPinned: number;
    lastMoment?: number | null;
    notViewed?: number | null;
    notRead?: number | null;
    notViewedMoment?: number | null;
    notReadMoment?: number | null;
}

export interface FeedStatusChange {
    viewed?: boolean | null;
    read?: boolean | null;
    before: number;
}

export interface FeedWithStatus {
    feedName: string;
    notViewed: number;
    notRead: number;
}

export interface FriendGroupAssignment {
    id: string;
    operations?: FriendOperations | null;
}

export interface FriendGroupDescription {
    title: string;
    operations?: FriendGroupOperations | null;
}

export interface FriendGroupDetails {
    id: string;
    title?: string | null;
    addedAt: number;
    operations?: FriendOperations | null;
}

export interface FriendGroupInfo {
    id: string;
    title?: string | null;
    createdAt: number;
    operations?: FriendGroupOperations | null;
}

export interface FriendGroupsFeatures {
    available: FriendGroupInfo[];
    memberOf?: FriendGroupDetails[] | null;
}

export interface FriendInfo {
    nodeName: string;
    contact?: ContactInfo | null;
    groups?: FriendGroupDetails[] | null;
}

export interface FriendOfInfo {
    remoteNodeName: string;
    contact?: ContactInfo | null;
    groups?: FriendGroupDetails[] | null;
}

export interface FundraiserInfo {
    title: string;
    qrCode?: string | null;
    text?: string | null;
    href?: string | null;
}

export interface GrantChange {
    scope: Scope[];
    revoke: boolean;
}

export interface GrantInfo {
    nodeName: string;
    scope: Scope[];
}

export interface LinkPreview {
    siteName?: string | null;
    url?: string | null;
    title?: string | null;
    description?: string | null;
    imageHash?: string | null;
}

export interface LinkPreviewInfo {
    siteName?: string | null;
    url?: string | null;
    title?: string | null;
    description?: string | null;
    imageUrl?: string | null;
}

export interface MediaFilePreviewInfo {
    targetWidth: number;
    directPath?: string | null;
    width: number;
    height: number;
    original?: boolean | null;
}

export interface MediaWithDigest {
    id: string;
    digest?: string | null;
}

export interface NameToRegister {
    name: string;
}

export interface NotificationPacket {
    id: string;
    nodeName: string;
    fullName?: string | null;
    gender?: string | null;
    avatar?: AvatarImage | null;
    createdAt: number;
    type: string;
    notification: string;
    signature: string;
    signatureVersion: number;
}

export interface NodeNameInfo {
    name?: string | null;
    operationStatus?: OperationStatus | null;
    operationStatusUpdated?: number | null;
    operationErrorCode?: string | null;
    operationErrorMessage?: string | null;
    operations?: NodeNameOperations | null;
}

export interface PeopleGeneralInfo {
    feedSubscribersTotal?: number | null;
    feedSubscriptionsTotal?: number | null;
    friendsTotal?: Partial<Record<string, number>> | null;
    friendOfsTotal?: number | null;
    blockedTotal?: number | null;
    blockedByTotal?: number | null;
    operations?: PeopleOperations | null;
}

export interface PluginContext {
    rootAdmin: boolean;
    admin: boolean;
    authCategories: string[];
    clientName: string;
    remoteAddress: string;
    userAgent: string;
    userAgentOs: string;
    nodeId: string;
    nodeName: string;
    domainName: string;
    originUrl: string;
}

export interface PostingFeatures {
    post?: boolean | null;
    subjectPresent: boolean;
    sourceFormats: SourceFormat[];
    mediaMaxSize: number;
    imageRecommendedSize: number;
    imageRecommendedPixels: number;
    imageFormats: string[];
}

export interface PostingSourceInfo {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    feedName: string;
    postingId: string;
    createdAt: number;
}

export interface PrivateMediaFileInfo {
    id: string;
    hash: string;
    path: string;
    directPath?: string | null;
    mimeType: string;
    width: number;
    height: number;
    orientation: number;
    size: number;
    postingId?: string | null;
    previews?: MediaFilePreviewInfo[] | null;
    operations?: PrivateMediaFileOperations | null;
}

export interface ProfileAttributes {
    fullName?: string | null;
    gender?: string | null;
    email?: string | null;
    title?: string | null;
    bioSrc?: string | null;
    bioSrcFormat?: SourceFormat | null;
    avatarId?: string | null;
    fundraisers?: FundraiserInfo[] | null;
    operations?: ProfileOperations | null;
}

export interface ProfileInfo {
    fullName?: string | null;
    gender?: string | null;
    email?: string | null;
    title?: string | null;
    bioSrc?: string | null;
    bioSrcFormat?: SourceFormat | null;
    bioHtml?: string | null;
    avatar?: AvatarInfo | null;
    fundraisers?: FundraiserInfo[] | null;
    operations?: ProfileOperations | null;
}

export interface PublicMediaFileInfo {
    id: string;
    path: string;
    width: number;
    height: number;
    orientation: number;
    size: number;
}

export interface PushRelayClientAttributes {
    type: PushRelayType;
    clientId: string;
    lang?: string | null;
}

export interface ReactionAttributes {
    negative: boolean;
    emoji: number;
    operations?: ReactionOperations | null;
}

export interface ReactionDescription {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarDescription | null;
    negative: boolean;
    emoji: number;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: ReactionOperations | null;
}

export interface ReactionsFilter {
    ownerName?: string | null;
    postings?: string[] | null;
}

export interface ReactionInfo {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarImage | null;
    postingId?: string | null;
    postingRevisionId?: string | null;
    commentId?: string | null;
    commentRevisionId?: string | null;
    negative?: boolean | null;
    emoji?: number | null;
    moment?: number | null;
    createdAt?: number | null;
    deadline?: number | null;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: ReactionOperations | null;
    ownerOperations?: ReactionOperations | null;
    seniorOperations?: ReactionOperations | null;
    majorOperations?: ReactionOperations | null;
}

export interface ReactionsSliceInfo {
    before: number;
    after: number;
    total: number;
    reactions: ReactionInfo[];
}

export interface ReactionTotalInfo {
    emoji: number;
    total?: number | null;
    share?: number | null;
}

export interface ReactionTotalsFilter {
    postings: string[];
}

export interface ReactionTotalsInfo {
    entryId: string;
    positive: ReactionTotalInfo[];
    negative: ReactionTotalInfo[];
}

export interface ReactionOverride {
    operations?: ReactionOperations | null;
    seniorOperations?: ReactionOperations | null;
    majorOperations?: ReactionOperations | null;
}

export interface RegisteredNameSecret {
    name: string;
    mnemonic?: string[] | null;
    secret?: string | null;
}

export interface RemoteFeed {
    nodeName: string;
    feedName: string;
}

export interface RemoteMedia {
    id: string;
    hash?: string | null;
    digest?: string | null;
}

export interface RemoteMediaInfo {
    id: string;
    hash?: string | null;
    digest?: string | null;
}

export interface RemotePosting {
    nodeName: string;
    postingId: string;
}

export interface RemotePostingOrNode {
    nodeName: string;
    postingId?: string | null;
}

export interface RemotePostingVerificationInfo {
    id: string;
    nodeName: string;
    postingId: string;
    revisionId?: string | null;
    status?: VerificationStatus | null;
    errorCode?: string | null;
    errorMessage?: string | null;
}

export interface RemoteReactionVerificationInfo {
    id: string;
    nodeName: string;
    postingId: string;
    reactionOwnerName: string;
    status?: VerificationStatus | null;
    errorCode?: string | null;
    errorMessage?: string | null;
}

export interface RepliedTo {
    id: string;
    revisionId?: string | null;
    name: string;
    fullName?: string | null;
    gender?: string | null;
    avatar?: AvatarImage | null;
    heading?: string | null;
    digest: string;
}

export interface Result {
    errorCode: string;
    message: string;
}

export interface SheriffMark {
    sheriffName: string;
}

export interface SettingInfo {
    name: string;
    value?: string | null;
}

export interface SettingMetaAttributes {
    name: string;
    defaultValue?: string | null;
    privileged?: boolean | null;
}

export interface SettingTypeModifiers {
    format?: string | null;
    min?: string | null;
    max?: string | null;
    multiline?: boolean | null;
    never?: boolean | null;
    always?: boolean | null;
    principals?: PrincipalFlag[] | null;
}

export interface SheriffComplaintDecisionText {
    reject: boolean;
    decisionCode?: SheriffOrderReason | null;
    decisionDetails?: string | null;
    anonymous?: boolean | null;
}

export interface SheriffComplaintGroupInfo {
    id: string;
    remoteNodeName: string;
    remoteNodeFullName?: string | null;
    remoteFeedName: string;
    remotePostingId?: string | null;
    remotePostingRevisionId?: string | null;
    remotePostingOwnerName?: string | null;
    remotePostingOwnerFullName?: string | null;
    remotePostingOwnerGender?: string | null;
    remotePostingHeading?: string | null;
    remoteCommentId?: string | null;
    remoteCommentRevisionId?: string | null;
    remoteCommentOwnerName?: string | null;
    remoteCommentOwnerFullName?: string | null;
    remoteCommentOwnerGender?: string | null;
    remoteCommentHeading?: string | null;
    createdAt: number;
    moment: number;
    status: SheriffComplaintStatus;
    decisionCode?: SheriffOrderReason | null;
    decisionDetails?: string | null;
    decidedAt?: number | null;
    anonymous?: boolean | null;
}

export interface SheriffComplaintGroupsSliceInfo {
    before: number;
    after: number;
    groups: SheriffComplaintGroupInfo[];
    total: number;
    totalInPast: number;
    totalInFuture: number;
}

export interface SheriffComplaintInfo {
    id: string;
    ownerName: string;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    group?: SheriffComplaintGroupInfo | null;
    reasonCode: SheriffOrderReason;
    reasonDetails?: string | null;
    anonymousRequested?: boolean | null;
    createdAt: number;
}

export interface SheriffComplaintText {
    ownerFullName?: string | null;
    ownerGender?: string | null;
    nodeName: string;
    fullName?: string | null;
    feedName: string;
    postingId?: string | null;
    postingOwnerName?: string | null;
    postingOwnerFullName?: string | null;
    postingOwnerGender?: string | null;
    postingHeading?: string | null;
    commentId?: string | null;
    commentOwnerName?: string | null;
    commentOwnerFullName?: string | null;
    commentOwnerGender?: string | null;
    commentHeading?: string | null;
    reasonCode?: SheriffOrderReason | null;
    reasonDetails?: string | null;
    anonymous?: boolean | null;
}

export interface SheriffOrderAttributes {
    delete?: boolean | null;
    feedName: string;
    postingId?: string | null;
    commentId?: string | null;
    category: SheriffOrderCategory;
    reasonCode?: SheriffOrderReason | null;
    reasonDetails?: string | null;
}

export interface SheriffOrderDetails {
    id: string;
    delete?: boolean | null;
    sheriffName: string;
    sheriffAvatar?: AvatarDescription | null;
    feedName: string;
    postingId?: string | null;
    commentId?: string | null;
    category: SheriffOrderCategory;
    reasonCode?: SheriffOrderReason | null;
    reasonDetails?: string | null;
    createdAt: number;
    signature: string;
    signatureVersion: number;
}

export interface SheriffOrderInfo {
    id: string;
    delete?: boolean | null;
    sheriffName: string;
    nodeName: string;
    nodeFullName?: string | null;
    feedName: string;
    postingId?: string | null;
    postingRevisionId?: string | null;
    postingOwnerName?: string | null;
    postingOwnerFullName?: string | null;
    postingOwnerGender?: string | null;
    postingHeading?: string | null;
    commentId?: string | null;
    commentRevisionId?: string | null;
    commentOwnerName?: string | null;
    commentOwnerFullName?: string | null;
    commentOwnerGender?: string | null;
    commentHeading?: string | null;
    category: SheriffOrderCategory;
    reasonCode?: SheriffOrderReason | null;
    reasonDetails?: string | null;
    createdAt: number;
    signature: string;
    signatureVersion: number;
    complaintGroupId?: string | null;
}

export interface StoryAttributes {
    feedName?: string | null;
    publishAt?: number | null;
    pinned?: boolean | null;
    viewed?: boolean | null;
    read?: boolean | null;
    satisfied?: boolean | null;
}

export interface StorySummaryBlocked {
    operations: BlockedOperation[];
    period?: number | null;
}

export interface StorySummaryFriendGroup {
    id?: string | null;
    title?: string | null;
}

export interface StorySummaryEntry {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    heading?: string | null;
    sheriffs?: string[] | null;
    sheriffMarks?: SheriffMark[] | null;
}

export interface StorySummaryNode {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
}

export interface StorySummaryPageClicks {
    heading?: string | null;
    href: string;
    clicks: number;
}

export interface StorySummaryReaction {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    emoji?: number | null;
}

export interface StorySummarySheriff {
    sheriffName: string;
    orderId?: string | null;
    complaintId?: string | null;
}

export interface SubscriberDescription {
    type: SubscriptionType;
    feedName?: string | null;
    postingId?: string | null;
    lastUpdatedAt?: number | null;
    operations?: SubscriberOperations | null;
}

export interface SubscriberInfo {
    id: string;
    type: SubscriptionType;
    feedName?: string | null;
    postingId?: string | null;
    nodeName: string;
    contact?: ContactInfo | null;
    createdAt: number;
    operations?: SubscriberOperations | null;
    ownerOperations?: SubscriberOperations | null;
    adminOperations?: SubscriberOperations | null;
}

export interface SubscriberOverride {
    operations?: SubscriberOperations | null;
    adminOperations?: SubscriberOperations | null;
}

export interface SubscriptionDescription {
    type: SubscriptionType;
    feedName?: string | null;
    remoteNodeName: string;
    remoteFeedName?: string | null;
    remotePostingId?: string | null;
    reason?: SubscriptionReason | null;
    operations?: SubscriptionOperations | null;
}

export interface SubscriptionFilter {
    type?: SubscriptionType | null;
    feeds?: RemoteFeed[] | null;
    postings?: RemotePosting[] | null;
}

export interface SubscriptionInfo {
    id: string;
    type: SubscriptionType;
    feedName?: string | null;
    remoteNodeName: string;
    contact?: ContactInfo | null;
    remoteFeedName?: string | null;
    remotePostingId?: string | null;
    createdAt: number;
    reason: SubscriptionReason;
    operations?: SubscriptionOperations | null;
}

export interface SubscriptionOverride {
    operations?: SubscriptionOperations | null;
}

export interface TokenAttributes {
    login: string;
    password: string;
    permissions?: Scope[] | null;
    name?: string | null;
}

export interface TokenInfo {
    id: string;
    token: string;
    name?: string | null;
    permissions: Scope[];
    pluginName?: string | null;
    createdAt: number;
    deadline?: number | null;
    lastUsedAt?: number | null;
    lastUsedBrowser?: string | null;
    lastUsedIp?: string | null;
}

export interface TokenUpdate {
    name?: string | null;
    permissions?: Scope[] | null;
}

export interface UpdateInfo {
    important?: boolean | null;
    description?: string | null;
}

export interface UserListInfo {
    name: string;
    total: number;
}

export interface UserListItemAttributes {
    nodeName: string;
}

export interface UserListItemInfo {
    nodeName: string;
    createdAt: number;
    moment: number;
}

export interface UserListSliceInfo {
    listName: string;
    before: number;
    after: number;
    items: UserListItemInfo[];
    total: number;
    totalInPast: number;
    totalInFuture: number;
}

export interface WhoAmI {
    nodeName?: string | null;
    nodeNameChanging?: boolean | null;
    fullName?: string | null;
    gender?: string | null;
    title?: string | null;
    avatar?: AvatarImage | null;
    frozen?: boolean | null;
}

export interface ActivityReactionFilter {
    postings?: RemotePosting[] | null;
}

export interface ActivityReactionInfo {
    remoteNodeName: string;
    remoteFullName?: string | null;
    remoteAvatar?: AvatarImage | null;
    remotePostingId: string;
    negative: boolean;
    emoji: number;
    createdAt: number;
}

export interface BlockedByUserFilter {
    blockedOperations?: BlockedOperation[] | null;
    postings?: RemotePostingOrNode[] | null;
    strict?: boolean | null;
}

export interface BlockedByUserInfo {
    id: string;
    blockedOperation: BlockedOperation;
    contact?: ContactInfo | null;
    nodeName: string;
    postingId?: string | null;
    createdAt: number;
    deadline?: number | null;
    reason?: string | null;
}

export interface BlockedUserInfo {
    id: string;
    blockedOperation: BlockedOperation;
    nodeName: string;
    contact?: ContactInfo | null;
    entryId?: string | null;
    entryNodeName?: string | null;
    entryPostingId?: string | null;
    createdAt: number;
    deadline?: number | null;
    reasonSrc?: string | null;
    reasonSrcFormat?: SourceFormat | null;
    reason?: string | null;
}

export interface Body {
    subject?: string | null;
    text?: string | null;
    linkPreviews?: LinkPreview[] | null;
}

export interface CommentRevisionInfoBase<B> {
    id: string;
    postingRevisionId: string;
    bodyPreview?: B | null;
    bodySrcHash: string;
    bodySrcFormat?: SourceFormat | null;
    body: B;
    bodyFormat?: BodyFormat | null;
    heading: string;
    createdAt: number;
    deletedAt?: number | null;
    deadline?: number | null;
    digest?: string | null;
    signature?: string | null;
    signatureVersion?: number | null;
    clientReaction?: ClientReactionInfo | null;
    reactions?: ReactionTotalsInfo | null;
}

export type EncodedCommentRevisionInfo = CommentRevisionInfoBase<string>;
export type CommentRevisionInfo = CommentRevisionInfoBase<Body>;

export interface CommentSourceText {
    ownerAvatar?: AvatarDescription | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    media?: MediaWithDigest[] | null;
    acceptedReactions?: AcceptedReactions | null;
    repliedToId?: string | null;
    operations?: CommentOperations | null;
    seniorOperations?: CommentOperations | null;
}

export interface CommentText {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarDescription | null;
    bodyPreview?: string | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    body?: string | null;
    bodyFormat?: BodyFormat | null;
    media?: string[] | null;
    createdAt?: number | null;
    acceptedReactions?: AcceptedReactions | null;
    repliedToId?: string | null;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: CommentOperations | null;
    reactionOperations?: ReactionOperations | null;
    seniorOperations?: CommentOperations | null;
}

export interface DraftText {
    draftType: DraftType;
    receiverName: string;
    receiverPostingId?: string | null;
    receiverCommentId?: string | null;
    repliedToId?: string | null;
    ownerFullName?: string | null;
    ownerAvatar?: AvatarDescription | null;
    acceptedReactions?: AcceptedReactions | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    media?: RemoteMedia[] | null;
    publishAt?: number | null;
    updateInfo?: UpdateInfo | null;
    operations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
}

export interface Features {
    posting: PostingFeatures;
    plugins?: string[] | null;
    feedWidth: number;
    friendGroups?: FriendGroupsFeatures | null;
    ask?: AskSubject[] | null;
    subscribed?: boolean | null;
}

export interface FeedInfo {
    feedName: string;
    title?: string | null;
    total: number;
    firstCreatedAt?: number | null;
    lastCreatedAt?: number | null;
    operations?: FeedOperations | null;
    sheriffs?: string[] | null;
    sheriffMarks?: SheriffMark[] | null;
}

export interface FriendDescription {
    nodeName: string;
    groups?: FriendGroupAssignment[] | null;
}

export interface MediaAttachment {
    media?: PrivateMediaFileInfo | null;
    remoteMedia?: RemoteMediaInfo | null;
    embedded: boolean;
}

export interface PostingInfoBase<B> {
    id: string;
    revisionId: string;
    receiverRevisionId?: string | null;
    totalRevisions: number;
    receiverName?: string | null;
    receiverFullName?: string | null;
    receiverGender?: string | null;
    receiverAvatar?: AvatarImage | null;
    receiverPostingId?: string | null;
    parentMediaId?: string | null;
    ownerName: string;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarImage | null;
    bodyPreview?: B | null;
    bodySrc?: B | null;
    bodySrcHash: string;
    bodySrcFormat?: SourceFormat | null;
    body: B;
    bodyFormat?: BodyFormat | null;
    media?: MediaAttachment[] | null;
    heading: string;
    updateInfo?: UpdateInfo | null;
    createdAt: number;
    editedAt?: number | null;
    deletedAt?: number | null;
    receiverCreatedAt?: number | null;
    receiverEditedAt?: number | null;
    receiverDeletedAt?: number | null;
    revisionCreatedAt: number;
    receiverRevisionCreatedAt?: number | null;
    deadline?: number | null;
    digest?: string | null;
    signature?: string | null;
    signatureVersion?: number | null;
    feedReferences?: FeedReference[] | null;
    blockedInstants?: BlockedPostingInstantInfo[] | null;
    operations?: PostingOperations | null;
    receiverOperations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
    reactionOperations?: ReactionOperations | null;
    commentReactionOperations?: ReactionOperations | null;
    blockedOperations?: BlockedEntryOperation[] | null;
    blockedCommentOperations?: BlockedEntryOperation[] | null;
    sheriffs?: string[] | null;
    sheriffMarks?: SheriffMark[] | null;
    acceptedReactions?: AcceptedReactions | null;
    clientReaction?: ClientReactionInfo | null;
    reactions?: ReactionTotalsInfo | null;
    sources?: PostingSourceInfo[] | null;
    totalComments?: number | null;
}

export type EncodedPostingInfo = PostingInfoBase<string>;
export type PostingInfo = PostingInfoBase<Body>;

export interface PostingRevisionInfoBase<B> {
    id: string;
    receiverId?: string | null;
    bodyPreview?: B | null;
    bodySrcHash: string;
    bodySrcFormat?: SourceFormat | null;
    body: B;
    bodyFormat?: BodyFormat | null;
    media?: MediaAttachment[] | null;
    heading: string;
    updateInfo?: UpdateInfo | null;
    createdAt: number;
    deletedAt?: number | null;
    receiverCreatedAt?: number | null;
    receiverDeletedAt?: number | null;
    digest?: string | null;
    signature?: string | null;
    signatureVersion?: number | null;
    clientReaction?: ClientReactionInfo | null;
    reactions?: ReactionTotalsInfo | null;
}

export type EncodedPostingRevisionInfo = PostingRevisionInfoBase<string>;
export type PostingRevisionInfo = PostingRevisionInfoBase<Body>;

export interface PostingSourceText {
    ownerAvatar?: AvatarDescription | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    media?: MediaWithDigest[] | null;
    acceptedReactions?: AcceptedReactions | null;
    operations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
}

export interface PostingText {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarDescription | null;
    bodyPreview?: string | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    body?: string | null;
    bodyFormat?: BodyFormat | null;
    media?: string[] | null;
    createdAt?: number | null;
    acceptedReactions?: AcceptedReactions | null;
    publications?: StoryAttributes[] | null;
    updateInfo?: UpdateInfo | null;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
    reactionOperations?: ReactionOperations | null;
    commentReactionOperations?: ReactionOperations | null;
}

export interface ReactionCreated {
    reaction?: ReactionInfo | null;
    totals: ReactionTotalsInfo;
}

export interface SettingDescriptor {
    name: string;
    type: SettingType;
    defaultValue?: string | null;
    internal?: boolean | null;
    privileged?: boolean | null;
    title?: string | null;
    modifiers?: SettingTypeModifiers | null;
}

export interface SettingMetaInfo {
    name: string;
    type: SettingType;
    defaultValue?: string | null;
    privileged?: boolean | null;
    title: string;
    modifiers?: SettingTypeModifiers | null;
}

export interface StorySummaryData {
    node?: StorySummaryNode | null;
    posting?: StorySummaryEntry | null;
    comment?: StorySummaryEntry | null;
    comments?: StorySummaryEntry[] | null;
    totalComments?: number | null;
    repliedTo?: StorySummaryEntry | null;
    parentPosting?: StorySummaryEntry | null;
    reaction?: StorySummaryReaction | null;
    reactions?: StorySummaryReaction[] | null;
    totalReactions?: number | null;
    feedName?: string | null;
    subscriptionReason?: SubscriptionReason | null;
    friendGroup?: StorySummaryFriendGroup | null;
    blocked?: StorySummaryBlocked | null;
    sheriff?: StorySummarySheriff | null;
    description?: string | null;
    clicks?: StorySummaryPageClicks[] | null;
}

export interface CommentInfoBase<B> {
    id: string;
    ownerName: string;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarImage | null;
    postingId: string;
    postingRevisionId: string;
    revisionId: string;
    totalRevisions: number;
    bodyPreview?: B | null;
    bodySrc?: B | null;
    bodySrcHash: string;
    bodySrcFormat?: SourceFormat | null;
    body: B;
    bodyFormat?: BodyFormat | null;
    media?: MediaAttachment[] | null;
    heading: string;
    repliedTo?: RepliedTo | null;
    moment: number;
    createdAt: number;
    editedAt?: number | null;
    deletedAt?: number | null;
    revisionCreatedAt: number;
    deadline?: number | null;
    digest?: string | null;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: CommentOperations | null;
    reactionOperations?: ReactionOperations | null;
    ownerOperations?: CommentOperations | null;
    seniorOperations?: CommentOperations | null;
    blockedOperations?: BlockedEntryOperation[] | null;
    sheriffMarks?: SheriffMark[] | null;
    acceptedReactions?: AcceptedReactions | null;
    clientReaction?: ClientReactionInfo | null;
    seniorReaction?: ClientReactionInfo | null;
    reactions?: ReactionTotalsInfo | null;
}

export type EncodedCommentInfo = CommentInfoBase<string>;
export type CommentInfo = CommentInfoBase<Body>;

export interface CommentsSliceInfoBase<B> {
    before: number;
    after: number;
    comments: CommentInfoBase<B>[];
    total: number;
    totalInPast: number;
    totalInFuture: number;
}

export type EncodedCommentsSliceInfo = CommentsSliceInfoBase<string>;
export type CommentsSliceInfo = CommentsSliceInfoBase<Body>;

export interface DraftInfoBase<B> {
    id: string;
    draftType: DraftType;
    receiverName: string;
    receiverPostingId?: string | null;
    receiverCommentId?: string | null;
    repliedToId?: string | null;
    createdAt: number;
    editedAt?: number | null;
    deadline?: number | null;
    ownerFullName?: string | null;
    ownerAvatar?: AvatarImage | null;
    acceptedReactions?: AcceptedReactions | null;
    bodySrc?: B | null;
    bodySrcFormat?: SourceFormat | null;
    body: B;
    bodyFormat?: BodyFormat | null;
    media?: MediaAttachment[] | null;
    heading: string;
    publishAt?: number | null;
    updateInfo?: UpdateInfo | null;
    operations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
}

export type EncodedDraftInfo = DraftInfoBase<string>;
export type DraftInfo = DraftInfoBase<Body>;

export interface EntryInfoBase<B> {
    posting?: PostingInfoBase<B> | null;
    comment?: CommentInfoBase<B> | null;
}

export type EncodedEntryInfo = EntryInfoBase<string>;
export type EntryInfo = EntryInfoBase<Body>;

export interface PluginDescription {
    name: string;
    title?: string | null;
    description?: string | null;
    location?: string | null;
    acceptedEvents?: string[] | null;
    options?: SettingDescriptor[] | null;
}

export interface PluginInfo {
    nodeId: string;
    local: boolean;
    name: string;
    title?: string | null;
    description?: string | null;
    location?: string | null;
    acceptedEvents?: string[] | null;
    settings?: SettingMetaInfo[] | null;
    tokenId?: string | null;
}

export interface StoryInfoBase<B> {
    id: string;
    feedName: string;
    storyType: StoryType;
    createdAt: number;
    publishedAt: number;
    pinned?: boolean | null;
    moment: number;
    viewed?: boolean | null;
    read?: boolean | null;
    satisfied?: boolean | null;
    summaryNodeName?: string | null;
    summaryFullName?: string | null;
    summaryAvatar?: AvatarImage | null;
    summary?: string | null;
    summaryData?: StorySummaryData | null;
    posting?: PostingInfoBase<B> | null;
    postingId?: string | null;
    comment?: CommentInfoBase<B> | null;
    commentId?: string | null;
    remoteNodeName?: string | null;
    remoteFullName?: string | null;
    remotePostingId?: string | null;
    remoteCommentId?: string | null;
    remoteMediaId?: string | null;
    operations?: StoryOperations | null;
}

export type EncodedStoryInfo = StoryInfoBase<string>;
export type StoryInfo = StoryInfoBase<Body>;

export interface CommentCreatedBase<B> {
    comment: CommentInfoBase<B>;
    total: number;
}

export type EncodedCommentCreated = CommentCreatedBase<string>;
export type CommentCreated = CommentCreatedBase<Body>;

export interface FeedSliceInfoBase<B> {
    before: number;
    after: number;
    stories: StoryInfoBase<B>[];
    totalInPast: number;
    totalInFuture: number;
}

export type EncodedFeedSliceInfo = FeedSliceInfoBase<string>;
export type FeedSliceInfo = FeedSliceInfoBase<Body>;

export interface PushContentBase<B> {
    type: PushContentType;
    id?: string | null;
    story?: StoryInfoBase<B> | null;
    feedStatus?: FeedWithStatus | null;
}

export type EncodedPushContent = PushContentBase<string>;
export type PushContent = PushContentBase<Body>;
