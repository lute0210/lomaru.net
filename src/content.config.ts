import { defineCollection, z } from "astro:content";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// microCMSのコンテンツローダー
const microCMSLoader = (endpoint: string) => {
  return async () => {
    try {
      console.log(`microCMSから${endpoint}データを取得中...`);
      const response = await client.getAllContents({
        endpoint,
      });
      console.log(`${response.length}件の${endpoint}を取得しました`);
      return response;
    } catch (error) {
      console.error(`microCMSからの${endpoint}取得に失敗:`, error);
      return [];
    }
  };
};

// 共通のフィールド
const microCMSDateFields = {
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
};

const microCMSImageSchema = z.object({
  url: z.string(),
  height: z.number(),
  width: z.number(),
});

// コレクションの定義
const news = defineCollection({
  loader: microCMSLoader("news"),
  schema: z.object({
    title: z.string(),
    link: z.string(),
    ...microCMSDateFields,
  }),
});

const categorySchema = z.object({
  name: z.string(),
  color: z.string(),
  ...microCMSDateFields,
});

const category = defineCollection({
  loader: microCMSLoader("category"),
  schema: categorySchema,
});

const blog = defineCollection({
  loader: microCMSLoader("blog"),
  schema: z.object({
    title: z.string(),
    categories: z.array(categorySchema),
    eyecatch: microCMSImageSchema,
    body: z.string(),
    ...microCMSDateFields,
  }),
});

// コレクションのエクスポート
export const collections = {
  news,
  category,
  blog,
};
