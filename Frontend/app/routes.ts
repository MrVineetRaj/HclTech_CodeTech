// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;

import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Landing page at root "/"
  index("routes/_index.tsx"),

  // Auth routes
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Patient portal
  layout("routes/patient.tsx", [
    route("patient/dashboard", "routes/patient.dashboard.tsx"),
    route("patient/medications", "routes/patient.medications.tsx"),
    route("patient/goals", "routes/patient.goals.tsx"),
    route("patient/medical-conditions", "routes/patient.medical-conditions.tsx"),
    route("patient/profile", "routes/patient.profile.tsx"),
  ]),

  // Provider portal
  layout("routes/provider.tsx", [
    route("provider/dashboard", "routes/provider.dashboard.tsx"),
    route("provider/patients/:id", "routes/provider.patient.$id.tsx"),
    route("provider/patients/invite", "routes/provider.patients.invite.tsx"),
    route("provider/profile", "routes/provider.profile.tsx"),
  ]),
] satisfies RouteConfig;
