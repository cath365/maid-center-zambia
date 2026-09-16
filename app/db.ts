type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
};

type MaidCenterBindings = {
  DB?: {
    prepare(query: string): D1Statement;
    batch(statements: D1Statement[]): Promise<unknown[]>;
  };
  BUCKET?: {
    put(key: string, value: unknown, options?: unknown): Promise<unknown>;
    get(key: string): Promise<unknown>;
    delete(key: string): Promise<unknown>;
  };
};

function runtimeBindings(): MaidCenterBindings {
  const runtime = globalThis as typeof globalThis & {
    __MAID_CENTER_BINDINGS__?: MaidCenterBindings;
    env?: MaidCenterBindings;
  };

  return runtime.__MAID_CENTER_BINDINGS__ ?? runtime.env ?? {};
}

export function database() {
  const db = runtimeBindings().DB;
  if (!db) {
    throw new Error(
      "Database unavailable in this runtime. This route still requires the Cloudflare D1 backend.",
    );
  }
  return db;
}

export function bucket() {
  const storage = runtimeBindings().BUCKET;
  if (!storage) {
    throw new Error(
      "Document storage unavailable in this runtime. This route still requires the Cloudflare R2 backend.",
    );
  }
  return storage;
}

export function clean(v: FormDataEntryValue | null, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function ref(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
