import express, { Router } from "express";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";
import * as dashboardController from "controllers/dashboard.controller";

const dashboardRouter = express.Router();

// routes
// admin or blogger
// get totals
// get growth rates
// get top performers

const utilGetRouteMapFunc = (
  routePath: string,
  controller: any,
  role: "admin" | "blogger"
) => {
  dashboardRouter
    .route(routePath)
    .get(authenticate, authoriseRole(role), controller);
};

// admin
const adminRoutes = [
  { route: "/admin/totals", controller: dashboardController.getAdminTotals },
  {
    route: "/admin/metrics-over-time",
    controller: dashboardController.getAdminMetricsOverTime,
  },
  {
    route: "/admin/growth-rates",
    controller: dashboardController.getAdminGrowthRates,
  },
  {
    route: "/admin/top-performers",
    controller: dashboardController.getAdminTopPerformers,
  },
  {
    route: "/admin/top-performers-options",
    controller: dashboardController.getTopPerformersOptions,
  },
  {
    route: "/admin/get-specific-analytics",
    controller: dashboardController.getSpecificAnalytics,
  },
];
adminRoutes.forEach((route) =>
  utilGetRouteMapFunc(route.route, route.controller, "admin")
);

// blogger
dashboardRouter
  .route("/blogger/analytics")
  .get(
    authenticate,
    authoriseRole("blogger"),
    dashboardController.getBloggerSpecificAnalytics
  );

export default dashboardRouter;

/* const bloggerRoutes = [ 
  {
    route: "/blogger/analytics",
    controller: dashboardController.getBloggerSpecificAnalytics,
  },
];
bloggerRoutes.forEach((route) =>
  utilGetRouteMapFunc(route.route, route.controller, "blogger")
); */
