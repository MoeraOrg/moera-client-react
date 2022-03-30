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
        edit?: string[] | null;
    } | null;
}

export interface TokenCreated {
    token: string;
    permissions: string[];
}

export interface NodeNameInfo {
    name?: string | null;
    operationStatus?: string | null;
    operationStatusUpdated?: number | null;
    operationErrorCode?: string | null;
    operationErrorMessage?: string | null;
    operations?: {
        manage?: string[] | null;
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
        edit?: string[] | null;
        delete?: string[] | null;
    } | null;
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

export interface PostingSubscriptionsInfo {
    comments: string | null;
}

export interface PostingText {
    ownerName?: string | null;
    ownerFullName?: string | null;
    ownerAvatar?: AvatarDescription | null;
    acceptedReactions?: AcceptedReactions | null;
    reactionsVisible?: boolean | null;
    reactionTotalsVisible?: boolean | null;
    bodyPreview?: string | null;
    bodySrc: string;
    bodySrcFormat?: SourceFormat | null;
    body?: Body | string | null;
    bodyFormat?: BodyFormat | null;
    media?: string[] | null;
    createdAt?: number | null;
    signature?: string | null;
    signatureVersion?: number | null;
    publications?: StoryAttributes[] | null;
    updateInfo?: UpdateInfo | null;
}

export interface PostingSourceText {
    ownerAvatar?: AvatarDescription | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    media?: MediaWithDigest[] | null;
    acceptedReactions?: AcceptedReactions | null;
}

export interface PostingInfoBase<B> {
    id: string;
    revisionId: string;
    receiverRevisionId?: string | null;
    totalRevisions: number;
    receiverName?: string | null;
    receiverFullName?: string | null;
    receiverAvatar?: AvatarImage | null;
    receiverPostingId?: string | null;
    parentMediaId?: string | null;
    ownerName: string;
    ownerFullName?: string | null;
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
    clientReaction?: ClientReactionInfo | null;
    operations?: {
        edit?: string[] | null;
        delete?: string[] | null;
        reactions?: string[] | null;
    } | null;
    acceptedReactions?: AcceptedReactions | null;
    reactions?: ReactionTotalsInfo | null;
    reactionsVisible?: boolean | null;
    reactionTotalsVisible?: boolean | null;
    sources?: PostingSourceInfo[] | null;
    totalComments?: number | null;
    subscriptions: PostingSubscriptionsInfo | null;
}

export type EncodedPostingInfo = PostingInfoBase<string>;
export type PostingInfo = PostingInfoBase<Body>;

type PartialPostingInfoBase<B> = Omit<Partial<PostingInfoBase<B>>, "id"> & { id: string };
export type EncodedPartialPostingInfo = PartialPostingInfoBase<string>;

export interface FeedInfo {
    feedName: string;
    subscriberId?: string | null;
    total: number;
    firstCreatedAt?: number | null;
    lastCreatedAt?: number | null;
    operations?: {
        add?: string[] | null;
    } | null;
}

export interface FeedStatus {
    total: number;
    totalPinned: number;
    notViewed?: number | null;
    notRead?: number | null;
    notViewedMoment?: number | null;
}

export interface CommentText {
    ownerName: string;
    ownerFullName?: string | null;
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
}

export interface RepliedTo {
    id: string;
    name: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    heading?: string | null;
}

interface CommentInfoBase<B> {
    id: string;
    ownerName: string;
    ownerFullName?: string | null;
    ownerAvatar?: AvatarImage | null;
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
    operations?: {
        edit?: string[] | null;
        delete?: string[] | null;
        revisions?: string[] | null;
        reactions?: string[] | null;
    } | null;
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
    | "posting-reaction-task-failed" | "comment-reaction-task-failed";

export interface StoryAttributes {
    feedName?: string | null;
    publishAt?: number | null;
    pinned?: boolean | null;
    viewed?: boolean | null;
    read?: boolean | null;
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
    posting?: PartialPostingInfoBase<B> | null;
    comment?: PartialCommentInfoBase<B> | null;
    summaryNodeName?: string | null;
    summaryFullName?: string | null;
    summaryAvatar?: AvatarImage | null;
    summary?: string | null;
    trackingId?: string | null;
    remoteNodeName?: string | null;
    remoteFullName?: string | null;
    remotePostingId?: string | null;
    remoteCommentId?: string | null;
    remoteMediaId?: string | null;
    operations?: {
        edit?: string[] | null;
        delete?: string[] | null;
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
    subjectPresent: boolean;
    sourceFormats: Choice<SourceFormat>[];
    mediaMaxSize: number;
    imageRecommendedSize: number;
    imageRecommendedPixels: number;
    imageFormats: string[];
}

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
}

export type SettingType = "bool" | "int" | "string" | "json" | "Duration" | "PrivateKey" | "PublicKey" | "Timestamp"
    | "UUID";

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

export interface ReactionInfo {
    ownerName?: string | null;
    ownerFullName?: string | null;
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
        delete?: string[] | null;
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

export interface SubscriberInfo {
    id: string;
    type: SubscriptionType;
    feedName?: string | null;
    postingId?: string | null;
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    createdAt: number;
}

export interface SubscriptionInfo {
    id: string;
    type: SubscriptionType;
    feedName?: string | null;
    remoteSubscriberId: string;
    remoteNodeName: string;
    remoteFullName?: string | null;
    remoteAvatar?: AvatarImage | null;
    remoteFeedName?: string | null;
    remotePostingId?: string | null;
    createdAt: number;
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
    feedSubscribersTotal: number;
    feedSubscriptionsTotal: number;
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
    avatar?: AvatarImage | null;
    closeness: number;
}

export interface EmailHint {
    emailHint: string;
}

export interface PublicMediaFileInfo {
    id: string;
    path: string;
    width: number;
    height: number;
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
    size: number;
    postingId?: string | null;
    previews?: MediaFilePreviewInfo[] | null;
}

export interface RemoteMediaInfo {
    id: string;
    hash: string;
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
    reactionsVisible?: boolean | null;
    reactionTotalsVisible?: boolean | null;
    bodySrc?: string | null;
    bodySrcFormat?: SourceFormat | null;
    media?: RemoteMedia[] | null;
    publishAt?: number | null;
    updateInfo?: UpdateInfo | null;
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
    reactionsVisible?: boolean | null;
    reactionTotalsVisible?: boolean | null;
    bodySrc?: B | null;
    bodySrcFormat?: SourceFormat | null;
    body: B;
    bodyFormat?: BodyFormat | null;
    media?: MediaAttachment[] | null;
    heading: string;
    publishAt?: number | null;
    updateInfo?: UpdateInfo | null;
}

export type EncodedDraftInfo = DraftInfoBase<string>;
export type DraftInfo = DraftInfoBase<Body>;
