import { z } from "astro/zod";
import { define, getResponseSchema } from ".";

export const StaticAPI = define({
  format: "object",
  endpoint: "static",
  schema: z.object({
    affiliation: z.string(),
    aboutme: z.string(),
    twitter: z.string(),
    bluesky: z.string(),
    github: z.string(),
  }),
});

export const NewsAPI = define({
  format: "list",
  endpoint: "news",
  schema: z.object({
    title: z.string(),
    link: z.string(),
  }),
});

export const CategoryAPI = define({
  format: "list",
  endpoint: "category",
  schema: z.object({
    name: z.string(),
    color: z.string(),
  }),
});

export const BlogAPI = define({
  format: "list",
  endpoint: "blog",
  schema: z.object({
    title: z.string(),
    categories: z.array(getResponseSchema(CategoryAPI)),
    eyecatch: z.object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
    }),
    body: z.string(),
  }),
});
