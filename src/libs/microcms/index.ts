import { z, type ZodObject, type ZodRawShape } from "astro/zod";
import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

// API interface
type Format = "list" | "object";

export interface API<F extends Format, S extends ZodRawShape> {
  format: F;
  endpoint: string;
  schema: ZodObject<S>;
}

export function define<F extends Format, S extends ZodRawShape>(
  api: API<F, S>,
): API<F, S> {
  return api;
}

// Client
const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

const DateShape = {
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
} as const;

const IDShape = {
  id: z.string(),
} as const;

// Adapter class & Executor
abstract class APIAdapter<F extends Format, S extends ZodRawShape> {
  api: API<F, S>;

  constructor(api: API<F, S>) {
    this.api = api;
  }
}

class ObjectAPIAdapter<S extends ZodRawShape> extends APIAdapter<"object", S> {
  responseSchema = getResponseSchema(this.api);

  async get(
    queries?: MicroCMSQueries,
  ): Promise<z.infer<typeof this.responseSchema>> {
    const response = await client.getObject({
      endpoint: this.api.endpoint,
      queries,
    });
    return this.responseSchema.parse(response);
  }
}

class ListAPIAdapter<S extends ZodRawShape> extends APIAdapter<"list", S> {
  responseSchema = getResponseSchema(this.api);
  responseList = z.array(this.responseSchema);

  async get(
    queries?: MicroCMSQueries,
  ): Promise<z.infer<typeof this.responseList>> {
    const response = await client.getAllContents({
      endpoint: this.api.endpoint,
      queries,
    });
    return this.responseList.parse(response);
  }
}

// Convert adapter function
export function use<S extends ZodRawShape>(
  api: API<"object", S>,
): ObjectAPIAdapter<S>;
export function use<S extends ZodRawShape>(
  api: API<"list", S>,
): ListAPIAdapter<S>;
export function use<S extends ZodRawShape>(
  api: API<Format, S>,
): APIAdapter<Format, S> {
  return api.format === "object"
    ? new ObjectAPIAdapter(api as API<"object", S>)
    : new ListAPIAdapter(api as API<"list", S>);
}

// Generate response schema
export function getResponseSchema<S extends ZodRawShape>(
  api: API<"object", S>,
): ZodObject<S & typeof DateShape>;
export function getResponseSchema<S extends ZodRawShape>(
  api: API<"list", S>,
): ZodObject<S & typeof DateShape & typeof IDShape>;
export function getResponseSchema<F extends Format, S extends ZodRawShape>(
  api: API<F, S>,
) {
  return api.format === "object"
    ? api.schema.extend(DateShape)
    : api.schema.extend(DateShape).extend(IDShape);
}
