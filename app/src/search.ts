import { Vendor } from "./api";

export type OpenSearchVendor = Pick<
  Vendor,
  "ID" | "Name" | "BusinessAddress" | "BusinessHours"
>;

export async function search(
  searchString: string
): Promise<OpenSearchVendor[]> {
  let headers = new Headers();
  headers.append("Authorization", `Basic ${btoa("admin:Streetfoodlove8090!")}`);

  const form = new URLSearchParams();
  form.set("source_content_type", "application/json");
  form.set(
    "source",
    JSON.stringify({
      query: {
        wildcard: {
          Name: `*${searchString}*`,
        },
      },
    })
  );
  const response = await fetch(
    `https://search-streetfoodlove-e4m4435lizlgmjfdk37gp6fo64.us-west-2.es.amazonaws.com/_search?${form.toString()}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const obj = await response.json();
  return obj.hits.hits.map(({ _source }) => _source);
}
