# Moera Web Client

Read more about Moera at https://moera.org

Learn more about Moera web client: http://moera.org/overview/browser-extension.html

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
5. Execute `./run` script.
6. New browser tab with the client in it is opened automatically. Since we
   don't use the client directly, but rather use the [browser extension][1]
   that loads it, you can close this browser tab.

[1]: https://github.com/MoeraOrg/moera-browser-extension
