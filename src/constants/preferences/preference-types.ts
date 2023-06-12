import { z } from "zod";

export type SubscribedChannelsType = {
  title: string;
  description: string;
};

export const VideoDataSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  channelId: z.string(),
  channelTitle: z.string(),
  publishedAt: z
    .string()
    .or(z.date())
    .transform((arg) => new Date(arg)),
  tags: z.array(z.string()).nullish().optional(),
  liked: z.boolean(),
});

const thumbnailsSchema = z.record(
  z.enum(["default", "medium", "high", "standard", "maxres"]),
  z.object({
    url: z.string().url().nullish(),
    width: z.number().gt(0).nullish(),
    height: z.number().gt(0).nullish(),
  })
);
export const FrontendVideoDataSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  channelId: z.string(),
  channelTitle: z.string(),
  thumbnails: thumbnailsSchema.nullish(),
  channelThumbnails: thumbnailsSchema.nullish(),
  publishedAt: z
    .string()
    .or(z.date())
    .transform((arg) => new Date(arg)),
  tags: z.array(z.string()).nullish().optional(),
  views: z.number().gt(0),
});

export type VideoData = z.infer<typeof VideoDataSchema>;
export type FrontendVideoData = z.infer<typeof FrontendVideoDataSchema>;
