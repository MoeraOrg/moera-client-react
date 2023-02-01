export interface Result {
    errorCode: string;
    message: string;
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
    optional?: boolean;
}

export interface AvatarImage {
    mediaId: string;
    path: string;
    width: number;
    height: number;
    shape?: string | null;
}

export interface AvatarInfo {
    id: string;
    mediaId: string;
    path: string;
    width: number;
    height: number;
    shape?: string | null;
    ordinal: number;
}

export interface WhoAmI {
    nodeName?: string | null;
    nodeNameChanging?: boolean | null;
    fullName?: string | null;
    gender?: string | null;
    title?: string | null;
    avatar?: AvatarImage | null;
}

export interface FundraiserInfo {
    title: string;
    qrCode?: string | null;
    text?: string | null;
    href?: string | null;
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
    operations?: {
        viewEmail?: PrincipalValue | null;
    } | null;
}

export interface ProfileInfo {
    fullName?: string | null;
    gender?: string | null;
    email?: string | null;
    title?: string | null;
    bioSrc?: string | null;
    bioHtml?: string | null;
    avatar?: AvatarInfo | null;
    fundraisers?: FundraiserInfo[] | null;
    operations?: {
        viewEmail?: PrincipalValue | null;
        edit?: PrincipalValue | null;
    } | null;
}

export interface TokenInfo {
    id: string;
    token: string;
    name?: string | null;
    permissions: string[];
    pluginName?: string | null;
    createdAt: number;
    deadline?: number | null;
    lastUsedAt?: number | null;
    lastUsedBrowser?: string | null;
    lastUsedIp?: string | null;
}

export interface NodeNameInfo {
    name?: string | null;
    operationStatus?: string | null;
    operationStatusUpdated?: number | null;
    operationErrorCode?: string | null;
    operationErrorMessage?: string | null;
    operations?: {
        manage?: PrincipalValue | null;
    } | null;
}

export interface RegisteredNameSecret {
    name: string;
    mnemonic: string[];
    secret: string;
}

export interface LinkPreviewInfo {
    siteName?: string | null;
    url?: string | null;
    title?: string | null;
    description?: string | null;
    imageUrl?: string | null;
}

export interface LinkPreview {
    siteName?: string | null;
    url?: string | null;
    title?: string | null;
    description?: string | null;
    imageHash?: string | null;
}

export interface Body {
    subject?: string | null;
    text?: string | null;
    linkPreviews?: LinkPreview[] | null;
}

export interface ReactionTotalInfo {
    emoji: number;
    total?: number | null;
    share?: number | null;
}

export interface ReactionTotalsInfo {
    entryId: string;
    positive: ReactionTotalInfo[];
    negative: ReactionTotalInfo[];
}

export interface UpdateInfo {
    important?: boolean | null;
    description?: string | null;
}

export type SourceFormat = "plain-text" | "html" | "markdown" | "application";

export type BodyFormat = "message" | "application";

export interface FeedReference {
    feedName: string;
    publishedAt: number;
    pinned?: boolean | null;
    moment: number;
    storyId: string;
    operations?: {
        edit?: PrincipalValue | null;
        delete?: PrincipalValue | null;
    } | null;
}

export interface BlockedInstantAttributes {
    storyType: StoryType;
    entryId?: string | null;
}

export interface BlockedInstantInfo {
    id: string;
    storyType: StoryType;
    entryId?: string | null;
    createdAt: number;
}

export interface BlockedPostingInstantInfo {
    id: string;
    storyType: StoryType;
}

export interface ClientReactionInfo {
    negative: boolean;
    emoji: number;
    createdAt: number;
    deadline?: number | null;
}

export interface AcceptedReactions {
    positive: string;
    negative: string;
}

export interface PostingSourceInfo {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    feedName: string;
    postingId: string;
    createdAt: number;
}

export interface PostingOperations {
    view?: PrincipalValue | null;
    viewComments?: PrincipalValue | null;
    addComment?: PrincipalValue | null;
    viewReactions?: PrincipalValue | null;
    viewNegativeReactions?: PrincipalValue | null;
    viewReactionTotals?: PrincipalValue | null;
    viewNegativeReactionTotals?: PrincipalValue | null;
    viewReactionRatios?: PrincipalValue | null;
    viewNegativeReactionRatios?: PrincipalValue | null;
    addReaction?: PrincipalValue | null;
    addNegativeReaction?: PrincipalValue | null;
}

export interface PostingOperationsInfo {
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
}

export interface PostingText {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarDescription | null;
    acceptedReactions?: AcceptedReactions | null;
    bodyPreview?: string | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    body?: Body | string | null;
    bodyFormat?: BodyFormat | null;
    media?: string[] | null;
    createdAt?: number | null;
    signature?: string | null;
    signatureVersion?: number | null;
    publications?: StoryAttributes[] | null;
    updateInfo?: UpdateInfo | null;
    operations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
}

export interface PostingSourceText {
    ownerAvatar?: AvatarDescription | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    media?: MediaWithDigest[] | null;
    acceptedReactions?: AcceptedReactions | null;
    operations?: PostingOperations | null;
    commentOperations?: CommentOperations | null;
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
    signature?: string | null;
    signatureVersion?: number | null;
    feedReferences?: FeedReference[] | null;
    blockedInstants?: BlockedPostingInstantInfo[] | null;
    clientReaction?: ClientReactionInfo | null;
    operations?: PostingOperationsInfo | null;
    receiverOperations?: PostingOperationsInfo | null;
    commentOperations?: CommentOperationsInfo | null;
    acceptedReactions?: AcceptedReactions | null;
    reactions?: ReactionTotalsInfo | null;
    sources?: PostingSourceInfo[] | null;
    totalComments?: number | null;
}

export type EncodedPostingInfo = PostingInfoBase<string>;
export type PostingInfo = PostingInfoBase<Body>;

type PartialPostingInfoBase<B> = Omit<Partial<PostingInfoBase<B>>, "id"> & { id: string };
export type EncodedPartialPostingInfo = PartialPostingInfoBase<string>;

export interface FeedInfo {
    feedName: string;
    total: number;
    firstCreatedAt?: number | null;
    lastCreatedAt?: number | null;
    operations?: {
        add?: PrincipalValue | null;
    } | null;
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

export interface CommentOperations {
    view?: PrincipalValue | null;
    viewReactions?: PrincipalValue | null;
    viewNegativeReactions?: PrincipalValue | null;
    viewReactionTotals?: PrincipalValue | null;
    viewNegativeReactionTotals?: PrincipalValue | null;
    viewReactionRatios?: PrincipalValue | null;
    viewNegativeReactionRatios?: PrincipalValue | null;
    addReaction?: PrincipalValue | null;
    addNegativeReaction?: PrincipalValue | null;
}

export interface CommentText {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    ownerAvatar?: AvatarDescription | null;
    bodyPreview?: string | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    body?: Body | string | null;
    bodyFormat?: BodyFormat | null;
    media?: string[] | null;
    createdAt?: number | null;
    acceptedReactions?: AcceptedReactions | null;
    repliedToId?: string | null;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: CommentOperations | null;
    seniorOperations?: CommentOperations | null;
}

export interface MediaWithDigest {
    id: string;
    digest?: string | null;
}

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

export interface CommentMassAttributes {
    seniorOperations?: CommentOperations | null;
}

export interface RepliedTo {
    id: string;
    name: string;
    fullName?: string | null;
    gender?: string | null;
    avatar?: AvatarImage | null;
    heading?: string | null;
}

export interface CommentOperationsInfo {
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

interface CommentInfoBase<B> {
    id: string;
    ownerName: string;
    ownerFullName?: string | null;
    ownerAvatar?: AvatarImage | null;
    ownerGender?: string | null;
    postingId: string;
    postingRevisionId: string;
    revisionId: string;
    totalRevisions: number;
    bodyPreview?: B | null;
    bodySrc?: B | null;
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
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: CommentOperationsInfo | null;
    ownerOperations?: CommentOperationsInfo | null;
    seniorOperations?: CommentOperationsInfo | null;
    acceptedReactions?: AcceptedReactions | null;
    clientReaction?: ClientReactionInfo | null;
    seniorReaction?: ClientReactionInfo | null;
    reactions?: ReactionTotalsInfo | null;
}

export type EncodedCommentInfo = CommentInfoBase<string>;
export type CommentInfo = CommentInfoBase<Body>;

type PartialCommentInfoBase<B> = Omit<Partial<CommentInfoBase<B>>, "id"> & { id: string };
export type EncodedPartialCommentInfo = PartialCommentInfoBase<string>;

export type StoryType = "posting-added" | "reaction-added-positive" | "reaction-added-negative" | "mention-posting"
    | "subscriber-added" | "subscriber-deleted" | "comment-added" | "mention-comment" | "reply-comment"
    | "comment-reaction-added-positive" | "comment-reaction-added-negative" | "remote-comment-added"
    | "comment-post-task-failed" | "comment-update-task-failed" | "posting-updated" | "posting-post-task-failed"
    | "posting-update-task-failed" | "posting-media-reaction-added-positive" | "posting-media-reaction-added-negative"
    | "comment-media-reaction-added-positive" | "comment-media-reaction-added-negative"
    | "posting-media-reaction-failed" | "comment-media-reaction-failed" | "posting-subscribe-task-failed"
    | "posting-reaction-task-failed" | "comment-reaction-task-failed" | "friend-added" | "friend-deleted"
    | "friend-group-deleted" | "asked-to-subscribe" | "asked-to-friend";

export type SubscriptionReason = "user" | "mention" | "comment";

export interface StoryAttributes {
    feedName?: string | null;
    publishAt?: number | null;
    pinned?: boolean | null;
    viewed?: boolean | null;
    read?: boolean | null;
    satisfied?: boolean | null;
}

export interface StorySummaryNode {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
}

export interface StorySummaryEntry {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    heading?: string | null;
}

export interface StorySummaryReaction {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerGender?: string | null;
    emoji?: number | null;
}

export interface StorySummaryFriendGroup {
    id?: string | null;
    title?: string | null;
}

export interface StorySummaryData {
    node?: StorySummaryNode | null;
    posting?: StorySummaryEntry | null;
    comment?: StorySummaryEntry | null;
    comments?: StorySummaryEntry[] | null;
    totalComments?: number | null;
    repliedTo?: StorySummaryEntry | null;
    reaction?: StorySummaryReaction | null;
    reactions?: StorySummaryReaction[] | null;
    totalReactions?: number | null;
    feedName?: string | null;
    subscriptionReason?: SubscriptionReason | null;
    friendGroup?: StorySummaryFriendGroup | null;
    description?: string | null;
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
    posting?: PartialPostingInfoBase<B> | null;
    comment?: PartialCommentInfoBase<B> | null;
    summaryNodeName?: string | null;
    summaryFullName?: string | null;
    summaryAvatar?: AvatarImage | null;
    summary?: string | null;
    summaryData?: StorySummaryData | null;
    trackingId?: string | null;
    remoteNodeName?: string | null;
    remoteFullName?: string | null;
    remotePostingId?: string | null;
    remoteCommentId?: string | null;
    remoteMediaId?: string | null;
    operations?: {
        edit?: PrincipalValue | null;
        delete?: PrincipalValue | null;
    } | null;
}

export type EncodedStoryInfo = StoryInfoBase<string>;
export type StoryInfo = StoryInfoBase<Body>;

export interface FeedSliceInfoBase<B> {
    before: number;
    after: number;
    stories: StoryInfoBase<B>[];
    totalInPast: number;
    totalInFuture: number;
}
export type EncodedFeedSliceInfo = FeedSliceInfoBase<string>;
export type FeedSliceInfo = FeedSliceInfoBase<Body>;

export interface Choice<T> {
    value: T;
    title: string;
}

export interface PostingFeatures {
    post?: boolean | null;
    subjectPresent: boolean;
    sourceFormats: Choice<SourceFormat>[];
    mediaMaxSize: number;
    imageRecommendedSize: number;
    imageRecommendedPixels: number;
    imageFormats: string[];
}

export interface FriendOperations {
    view?: PrincipalValue | null;
}

export interface FriendGroupAssignment {
    id: string;
    operations?: FriendOperations | null;
}

export interface FriendDescription {
    nodeName: string;
    groups: FriendGroupAssignment[] | null;
}

export interface FriendGroupInfo {
    id: string;
    title?: string | null;
    createdAt: number;
    operations?: {
        view?: PrincipalValue | null;
    } | null;
}

export interface FriendGroupDetails {
    id: string;
    title?: string | null;
    addedAt: number;
    operations?: FriendOperations | null;
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

export interface FriendGroupsFeatures {
    available: FriendGroupInfo[];
    memberOf?: FriendGroupDetails[] | null;
}

export type AskSubject = "subscribe" | "friend";

export interface Features {
    posting: PostingFeatures;
    plugins?: string[] | null;
    feedWidth: number;
    friendGroups?: FriendGroupsFeatures | null;
    ask?: AskSubject[] | null;
    subscribed?: boolean | null;
}

export type PrincipalValue = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "unset" | string;

export type PrincipalFlag = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "friends" | "unset";

export interface SettingInfo {
    name: string;
    value: string | null;
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

export type SettingType = "bool" | "int" | "string" | "json" | "Duration" | "PrivateKey" | "PublicKey" | "Timestamp"
    | "UUID" | "Principal";

export interface SettingMetaInfo {
    name: string;
    type: SettingType;
    privileged: boolean;
    defaultValue?: string | null;
    title: string;
    modifiers?: SettingTypeModifiers | null;
}

export interface AsyncOperationCreated {
    id: string;
}

export interface CarteInfo {
    carte: string;
    beginning: number;
    deadline: number;
    permissions?: string[];
}

export interface CarteSet {
    cartesIp: string | null;
    cartes: CarteInfo[];
    createdAt: number;
}

export interface ReactionAttributes {
    negative: boolean;
    emoji: number;
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
    operations?: {
        delete?: PrincipalValue | null;
    } | null;
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
    createdAt? : number | null;
    deadline?: number | null;
    signature?: string | null;
    signatureVersion?: number | null;
    operations?: {
        delete?: PrincipalValue | null;
    } | null;
}

export interface ReactionCreated {
    reaction?: ReactionInfo | null;
    totals: ReactionTotalsInfo;
}

export interface ReactionsSliceInfo {
    before: number;
    after: number;
    total: number;
    reactions: ReactionInfo[];
}

export type SubscriptionType = "feed" | "posting" | "posting-comments" | "profile";

export interface SubscriberOperations {
    view?: PrincipalValue | null;
}

export interface SubscriberInfo {
    id: string;
    type: SubscriptionType;
    feedName?: string | null;
    postingId?: string | null;
    nodeName: string;
    contact?: ContactInfo | null;
    createdAt: number;
    operations?: {
        view?: PrincipalValue | null;
        delete?: PrincipalValue | null;
    } | null;
    ownerOperations?: {
        view?: PrincipalValue | null;
    } | null;
    adminOperations?: {
        view?: PrincipalValue | null;
    } | null;
}

export interface SubscriptionOperations {
    view?: PrincipalValue | null;
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
    operations?: {
        view?: PrincipalValue | null;
        delete?: PrincipalValue | null;
    } | null;
}

export interface RemoteFeed {
    nodeName: string;
    feedName: string;
}

export interface RemotePosting {
    nodeName: string;
    postingId: string;
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

export interface PeopleGeneralInfo {
    feedSubscribersTotal?: number | null;
    feedSubscriptionsTotal?: number | null;
    friendsTotal?: Partial<Record<string, number>> | null;
    friendOfsTotal?: number | null;
    blockedTotal?: number | null;
    blockedByTotal?: number | null;
    operations?: {
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
    } | null;
}

export interface CommentCreatedBase<B> {
    comment: CommentInfoBase<B>;
    total: number;
}
export type EncodedCommentCreated = CommentCreatedBase<string>;
export type CommentCreated = CommentCreatedBase<Body>;

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

export interface CommentTotalInfo {
    total: number;
}

export interface DomainInfo {
    name: string;
    nodeId: string;
}

export interface DomainAvailable {
    name: string;
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
    operations?: {
        viewFeedSubscriber?: PrincipalValue | null;
        viewFeedSubscription?: PrincipalValue | null;
        viewFriend?: PrincipalValue | null;
    },
    adminOperations?: {
        viewFeedSubscriber?: PrincipalValue | null;
        viewFeedSubscription?: PrincipalValue | null;
        viewFriend?: PrincipalValue | null;
        viewFriendOf?: PrincipalValue | null;
        viewBlock?: PrincipalValue | null;
        viewBlockBy?: PrincipalValue | null;
    }
}

export interface EmailHint {
    emailHint: string;
}

export interface PublicMediaFileInfo {
    id: string;
    path: string;
    width: number;
    height: number;
    orientation: number;
    size: number;
}

export interface MediaFilePreviewInfo {
    targetWidth: number;
    width: number;
    height: number;
    original?: boolean | null;
}

export interface PrivateMediaFileInfo {
    id: string;
    hash: string;
    path: string;
    mimeType: string;
    width: number;
    height: number;
    orientation: number;
    size: number;
    postingId?: string | null;
    previews?: MediaFilePreviewInfo[] | null;
    operations?: {
        view?: PrincipalValue | null;
    }
}

export interface RemoteMediaInfo {
    id: string;
    hash?: string | null;
    digest?: string | null;
}

export interface MediaAttachment {
    media?: PrivateMediaFileInfo | null;
    remoteMedia?: RemoteMediaInfo | null;
    embedded: boolean;
}

export interface AvatarOrdinal {
    id: string;
    ordinal: number;
}

export type DraftType = "new-posting" | "posting-update" | "new-comment" | "comment-update";

export interface RemoteMedia {
    id: string;
    hash?: string | null;
    digest?: string | null;
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
    operations?: {
        view?: PrincipalValue | null;
        viewComments?: PrincipalValue | null;
        addComment?: PrincipalValue | null;
        viewReactions?: PrincipalValue | null;
        viewNegativeReactions?: PrincipalValue | null;
        viewReactionTotals?: PrincipalValue | null;
        viewNegativeReactionTotals?: PrincipalValue | null;
        viewReactionRatios?: PrincipalValue | null;
        viewNegativeReactionRatios?: PrincipalValue | null;
        addReaction?: PrincipalValue | null;
        addNegativeReaction?: PrincipalValue | null;
    } | null;
}

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
    operations?: {
        view?: PrincipalValue | null;
        viewComments?: PrincipalValue | null;
        addComment?: PrincipalValue | null;
        viewReactions?: PrincipalValue | null;
        viewNegativeReactions?: PrincipalValue | null;
        viewReactionTotals?: PrincipalValue | null;
        viewNegativeReactionTotals?: PrincipalValue | null;
        viewReactionRatios?: PrincipalValue | null;
        viewNegativeReactionRatios?: PrincipalValue | null;
        addReaction?: PrincipalValue | null;
        addNegativeReaction?: PrincipalValue | null;
    } | null;
    commentOperations?: {
        view?: PrincipalValue | null;
        viewReactions?: PrincipalValue | null;
        viewNegativeReactions?: PrincipalValue | null;
        viewReactionTotals?: PrincipalValue | null;
        viewNegativeReactionTotals?: PrincipalValue | null;
        viewReactionRatios?: PrincipalValue | null;
        viewNegativeReactionRatios?: PrincipalValue | null;
        addReaction?: PrincipalValue | null;
        addNegativeReaction?: PrincipalValue | null;
    } | null;
}

export type EncodedDraftInfo = DraftInfoBase<string>;
export type DraftInfo = DraftInfoBase<Body>;

export interface PluginInfo {
    local: boolean;
    name: string;
    title?: string | null;
    description?: string | null;
    location?: string | null;
    acceptedEvents?: string[] | null;
    settings?: SettingMetaInfo[] | null;
    tokenId?: string | null;
}

export type BlockedOperation = "reaction" | "comment" | "posting" | "visibility" | "instant";

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
