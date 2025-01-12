import "jsr:@std/dotenv/load";

export const env = {
  openAI: {
    apiKey: Deno.env.get("OPENAI_APIKEY"),
  },
  google: {
    customSearch: {
      apiKey: Deno.env.get("GOOGLE_CUSTOM_SEARCH_API_KEY"),
      id: Deno.env.get("GOOGLE_CUSTOM_SEARCH_ID"),
    }
  },
  db: {
    host: Deno.env.get("DB_HOST"),
    port: Deno.env.get("DB_PORT"),
    user: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASSWORD"),
    database: Deno.env.get("DB_DATABASE"),
  }
}