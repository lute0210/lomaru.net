// SDK利用準備
import type { MicroCMSDate, MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// 型定義
export type Static = {
  affiliation: string;
  aboutme: string;
  twitter: string;
  bluesky: string;
  github: string;
} & MicroCMSDate;

// APIの呼び出し
export const getStatic = async (queries?: MicroCMSQueries) => {
  return await client.getObject<Static>({ endpoint: "static", queries });
};
