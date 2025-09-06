// src\app\(dashboard)\manage-ads\page.tsx
import WelcomeManagement from "../components/AppWelcomeScreen/WelcomeManagement";
import DashboardHeader from "../components/dashboard-header";

export default function BannerPage() {
  return (
    <div>
      <DashboardHeader
        title='App Welcome Image'
        subtitle='Manage your app Welcome section images'
      />
      <div className='p-2 md:p-6'>
        <WelcomeManagement
          itemsPerPage={4}
          showWelcomeScreens={4}
          title='All Images'
        />
      </div>
    </div>
  );
}
