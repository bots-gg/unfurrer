const parseHex = (hex: string) => {
  const buf = new ArrayBuffer(hex.length / 2);
  const bufView = new Uint8Array(buf);

  for (let i = 0; i < hex.length; i += 2) {
    const int = parseInt(hex.substring(i, i + 2), 16);
    if (isNaN(int)) return new ArrayBuffer(0);

    bufView[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  return buf;
};

const parseB64 = (b64: string) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo_import
  const parsed = atob(b64);
  const buf = new ArrayBuffer(parsed.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < parsed.length; i++) {
    bufView[i] = parsed.charCodeAt(i);
  }

  return buf;
};

export interface Env {
  PUBLIC_KEY: string;
}

export default {
  async fetch(request: Request, { PUBLIC_KEY }: Env): Promise<Response> {
    const url = new URL(request.url);
    const subUrl = url.searchParams.get("url");
    const signature = url.searchParams.get("signature");

    if (!subUrl)
      return new Response("`url` expected as a query parameter.", {
        status: 400,
      });
    if (!signature)
      return new Response("`signature` expected as a query parameter.", {
        status: 400,
      });

    const cryptoKey = await crypto.subtle.importKey(
      "spki",
      parseB64(PUBLIC_KEY),
      { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
      false,
      ["verify"]
    );
    const ok = await crypto.subtle
      .verify(
        "NODE-ED25519",
        cryptoKey,
        parseHex(signature),
        new TextEncoder().encode(subUrl)
      )
      .catch(() => false);

    if (!ok) return new Response("Failed signature check.", { status: 403 });

    // Does this have an inbuilt redirect limit?
    const res = await fetch(subUrl);

    return Response.json({ url: res.url });
  },
};
