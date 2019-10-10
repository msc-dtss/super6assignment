const fs = require('fs')

/**
 * Loads every js module in it's directory as a route.
 * The module's name will be the endpoint (`/moduleName`), except any file called index.js, which will mount on `/`
 * @param {string} routesDir relative path to the directory containing this module from the root of the application
 * @return {Object} An object with the endpoints and the respective route module
 */
const requireRouteModules = (routesDir) => {
  const routes = {};
  const files = fs.readdirSync(routesDir);
  files.forEach(file => {
    // Don't load itself!!!
    if (file !== "autoloader.js") {
      // get the name of the module without the .js
      const moduleName = file.split('.').slice(0, -1).join('.');

      // auto import it
      const routeModule = require(`./${moduleName}`);

      // auto-create an endpoint
      const route = moduleName === 'index' ? '/' : `/${moduleName}`;
      routes[route] = routeModule;
    }
  });
  return routes;
};

/**
 * Auto loads and mounts route modules to endpoints according to their name.
 * A module called `users.js` will be mounted to `/users`.
 * The exception to this is `index.js` which will always mount to `/`.
 * @param {*} app the Express app to load the routes onto
 */
const loadRoutes = (app) => {
  const routes = requireRouteModules('./routes');
  for (let endpoint in routes) {
    console.log(`Loading ${endpoint}`);
    app.use(endpoint, routes[endpoint]);
  }
};

module.exports = {
  load: loadRoutes
}