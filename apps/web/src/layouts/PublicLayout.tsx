import { Outlet } from 'react-router-dom';

/** Route shell only — no page chrome (Header/Footer live in components/Layout). */
export const PublicLayout = () => {
  return <Outlet />;
};
