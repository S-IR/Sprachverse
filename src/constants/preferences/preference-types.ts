export type VideoData = {
  title: string;
  description: string | undefined | null;
  videoOwnerChannelId: string;
  videoOwnerChannelTitle: string;
  publishedAt: Date;
  tags: string[];
  liked: boolean;
};
export type SubscribedChannelsType = {
  title: string;
  description: string;
};
