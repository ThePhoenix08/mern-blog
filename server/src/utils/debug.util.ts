export const printRoutes = (routers: any) => {
  routers.stack.forEach((middleware: any) => {
    if (middleware.name === "router") {
      // If the middleware is a router
      console.log(`\nmiddleware regexp: ${middleware.regexp.toString()}`);
      (middleware.handle as { stack: Array<{ route?: any }> }).stack.forEach(
        (handler) => {
          if (handler.route) {
            console.log(
              `\t${Object.keys(handler.route.methods).join(", ").toUpperCase()} ${handler.route.path}`
            );
          }
        }
      );
    } else {
      console.log(middleware.name);
    }
  });
};
