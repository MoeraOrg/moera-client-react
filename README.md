# Moera Web Client

Read more about Moera at https://moera.org

Learn more about Moera web client: http://moera.org/overview/browser-extension.html

Bugs and feature requests: https://github.com/MoeraOrg/moera-issues/issues

How to setup a complete Moera Development Environment:
http://moera.org/development/setup/index.html

Installation instructions:

1. As prerequisites you need to have Node.js 8.12+ and Yarn installed.
2. Go to the source directory.
3. Install project dependencies:
   ```
   yarn install
   ```
4. By default, the server that serves the client runs on port 3000. If you want
   it to run on a different port, change the value of `PORT` variable in
   `./run` script.
5. Make sure that the [naming server][2] location is set correctly in
   `src/node_modules/state/naming/reducer.js`.
6. Execute `./run` script.
7. New browser tab with the client in it is opened automatically. Since we
   don't use the client directly, but rather use the [browser extension][1]
   that loads it, you can close this browser tab.

## Note for WebStorm/IntelliJ users

The project uses absolute paths for imports. If your IDE complains about
non-installed modules, you may do the following (or read [the full
instructions](https://medium.com/hackernoon/absolute-imports-with-create-react-app-4c6cfb66c35d)):

1. Mark the `src/` directory as a Resources Root.
2. Go to **Settings > Editor > Code Style > JavaScript**, go to
   the **Imports** tab and tick **Use paths relative to the project, resource
   or sources roots**.

[1]: https://github.com/MoeraOrg/moera-browser-extension
[2]: https://github.com/MoeraOrg/moera-naming
