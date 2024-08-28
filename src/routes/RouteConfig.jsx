import AdminRoutes from './AdminRoutes';
import HomeRoutes from './HomeRoutes';
import CommonRoutes from './CommonRoutes';

export const routeConfig = [...HomeRoutes, ...AdminRoutes, ...CommonRoutes];