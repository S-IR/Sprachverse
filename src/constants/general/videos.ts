import { z } from "zod";
import { FrontendVideoData, FrontendVideoDataSchema } from "../preferences/preference-types";

export type youtubeCategory =
  | `Autos & Vehicles`
  | `Comedy`
  | `Education`
  | `Entertainment`
  | `Film & Animation`
  | `Gaming`
  | `Howto & Style`
  | `Music`
  | `News & Politics`
  | `Nonprofits & Activism`
  | `People & Blogs`
  | `Pets & Animals`
  | `Science & Technology`
  | `Sports`
  | `Travel & Events`;
export const youtubeCategories: youtubeCategory[] = [
  `Autos & Vehicles`,
  `Comedy`,
  `Education`,
  `Entertainment`,
  `Film & Animation`,
  `Gaming`,
  `Howto & Style`,
  `Music`,
  `News & Politics`,
  `Nonprofits & Activism`,
  `People & Blogs`,
  `Pets & Animals`,
  `Science & Technology`,
  `Sports`,
  `Travel & Events`,
];
export const FrontendVideoObjSchema = z.record(z.string(), FrontendVideoDataSchema)
export type FrontendVideoObj = z.infer<typeof FrontendVideoObjSchema>
