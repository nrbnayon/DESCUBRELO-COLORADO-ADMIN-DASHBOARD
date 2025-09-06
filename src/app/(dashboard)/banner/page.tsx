// src\app\(dashboard)\manage-ads\page.tsx
import DashboardHeader from "../components/dashboard-header";
import BannerManagement from "../components/HeroBanner/BannerManagement";

export default function BannerPage() {
  return (
    <div>
      <DashboardHeader
        title='Banner'
        subtitle='Manage your app hero section banner'
      />
      <div className='p-2 md:p-6'>
        <BannerManagement
          itemsPerPage={12}
          showBanners={8}
          title='All Banner'
        />
      </div>
    </div>
  );
}
