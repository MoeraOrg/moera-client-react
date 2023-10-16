# Moera Web Client

## Resources

* Live network: https://web.moera.org
* Read more about Moera at https://moera.org
* Bugs and feature requests: https://github.com/MoeraOrg/moera-issues/issues
* How to set up a complete Moera Development Environment:
http://moera.org/development/development-environment.html

## Installation instructions

1. As prerequisites, you need to have Node.js 8.12+ and Yarn installed.
2. Go to the source directory.
3. Install project dependencies with `yarn install`.
4. By default, the web server that serves the client runs on port 3000. If you
   want it to run on a different port, change the value of `PORT` variable in
   `./run` script.
5. If you use your own [naming server][1], make sure its location is set correctly
   in client settings.
6. Execute `./run` script.
7. A new browser tab with the client in it is opened automatically.

## Note for WebStorm/IntelliJ users

The project uses absolute paths for imports. If your IDE complains about
non-installed modules, you may do the following (or read [the full
instructions][2]):

1. Mark the `src/` directory as a Resources Root.
2. Go to **Settings > Editor > Code Style > JavaScript**, go to
   the **Imports** tab and tick **Use paths relative to the project, resource
   or sources roots**.
3. Go to **Settings > Editor > Code Style > TypeScript**, go to
   the **Imports** tab and tick **Use paths relative to tsconfig.json**.

[1]: https://github.com/MoeraOrg/moera-naming
[2]: https://medium.com/hackernoon/absolute-imports-with-create-react-app-4c6cfb66c35d
