# unfurrer

URL unfurling service that requires signed requests to function, running on
[Cloudflare Workers](https://workers.cloudflare.com/).

## Setup

1. Install Wrangler 2 (`yarn global add wrangler` or `npm i -g wrangler`) or
   install it through this projects dependencies.
2. Generate a public Ed25519 key, exported under SPKI mode with PEM formatting.
   Should look like this:

```
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAzOWQ2fB4o1cNL8aBEz3EHdUQc9RlqVs+k4BMq/F5his=
-----END PUBLIC KEY-----
```

3. Set the inside
   (`MCowBQYDK2VwAyEAzOWQ2fB4o1cNL8aBEz3EHdUQc9RlqVs+k4BMq/F5his=`) as the
   `PUBLIC_KEY` secret (`yarn wrangler secret put PUBLIC_KEY` or
   `npx wrangler secret put PUBLIC_KEY`), responding to the prompt with the
   public key.
4. Edit `wrangler.toml` to have an up to date `routes` key.
5. Deploy with `yarn deploy` (or `npm run deploy`)!
