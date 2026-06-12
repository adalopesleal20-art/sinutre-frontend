import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';

const DRAWER_ID = 'main-drawer';

export function AppLayout() {
  return (
    <div className="drawer lg:drawer-open bg-base-200 text-base-content min-h-screen">
      <input
        id={DRAWER_ID}
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex flex-col items-center p-4 lg:p-8 w-full">
        <Outlet />
      </div>

      <Sidebar drawerId={DRAWER_ID} />
    </div>
  );
}