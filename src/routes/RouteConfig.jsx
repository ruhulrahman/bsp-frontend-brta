import AdminRoutes from './AdminRoutes';
import ApplicantRoutes from './ApplicantRoutes';
import SystemUserRoutes from './SystemUserRoutes';
import HomeRoutes from './HomeRoutes';
import CommonRoutes from './CommonRoutes';

export const routeConfig = [...HomeRoutes, ...AdminRoutes, ...ApplicantRoutes, ...SystemUserRoutes, ...CommonRoutes];