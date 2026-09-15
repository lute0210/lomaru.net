import { z, ZodObject } from "astro/zod";
import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

const DateSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
});

type ExtendWithDate<T extends ZodObject> = z.ZodObject<
  T["shape"] & typeof DateSchema.shape
>;

abstract class API<T extends ZodObject> {
  private _endpoint: string;
  private _schema: ExtendWithDate<T>;

  constructor(endpoint: string, schema: T) {
    this._endpoint = endpoint;
    this._schema = schema.extend(DateSchema.shape);
  }

  get endpoint() {
    return this._endpoint;
  }

  get schema() {
    return this._schema;
  }
}

export class ListAPI<T extends ZodObject> extends API<T> {
  private _schemaWithID = this.schema.extend({ id: z.string() });
  private _dataSchema = z.array(this._schemaWithID);

  constructor(endpoint: string, schema: T) {
    super(endpoint, schema);
  }

  async get(
    queries?: MicroCMSQueries,
  ): Promise<z.infer<typeof this._dataSchema>> {
    try {
      const response = await client.getAllContents<
        z.infer<typeof this._schemaWithID>
      >({ endpoint: this.endpoint, queries });
      return this._dataSchema.parse(response);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export class ObjectAPI<T extends ZodObject> extends API<T> {
  constructor(endpoint: string, schema: T) {
    super(endpoint, schema);
  }

  async get(): Promise<z.infer<typeof this.schema>> {
    try {
      const response = await client.getObject<z.infer<typeof this.schema>>({
        endpoint: this.endpoint,
      });
      return this.schema.parse(response);
    } catch (error) {
      console.error(error);
      return {} as any;
    }
  }
}
