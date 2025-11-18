// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing page at root "/"
  index("routes/_index.tsx"),

  // Auth routes
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
] satisfies RouteConfig;
