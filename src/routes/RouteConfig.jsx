import AdminRoutes from './AdminRoutes';
import ApplicantRoutes from './ApplicantRoutes';
import HomeRoutes from './HomeRoutes';
import CommonRoutes from './CommonRoutes';

export const routeConfig = [...HomeRoutes, ...AdminRoutes, ...ApplicantRoutes, ...CommonRoutes];