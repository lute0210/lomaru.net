import { z } from "astro/zod";
import { ListAPI, ObjectAPI } from ".";

export const StaticAPI = new ObjectAPI(
  "static",
  z.object({
    affiliation: z.string(),
    aboutme: z.string(),
    twitter: z.string(),
    bluesky: z.string(),
    github: z.string(),
  }),
);

export const NewsAPI = new ListAPI(
  "news",
  z.object({
    title: z.string(),
    link: z.string(),
  }),
);

export const CategoryAPI = new ListAPI(
  "category",
  z.object({
    name: z.string(),
    color: z.string(),
  }),
);

export const BlogAPI = new ListAPI(
  "blog",
  z.object({
    title: z.string(),
    categories: z.array(CategoryAPI.schema),
    eyecatch: z.object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
    }),
    body: z.string(),
  }),
);
