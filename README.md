A reproduction of a bug in vite where an error with no name causes `ssrRewriteStacktrace` to fail when running in a Bun environment.

To reproduce the bug:

- Ensure bun is installed and at least version `1.2.4`
- Clone this repo
- Run `bun install`
- Run `bun dev`
- Cause an anonymous error

On first load of `/anonymous-error`, a client error will pop up as loaderData is undefined. If you refresh on this page, the server error will then show up.
However, the `Content-Type` of this vite error page seems to be `text/plain` for whatever reason. That is an issue, but it's outside of the scope of this repro.

### Details

Once the error has been thrown within an anonymous function, `ssrRewriteStacktrace` runs a replacer over the error stack trace that has been caught with a regexp that contains an optional catch group, `varName`.
In vite's current state, the case where `varName = undefined` is not handled and the function fails when it tries to access `.trim` on `undefined`.

Even though this bug is experienced with Bun in this case, it is entirely possible for an entry in the stack trace to contain no `varName` even in Node.
