"use client";

import DashboardHeader from "../components/dashboard-header";
import ProfilePage from "../components/Profile/ProfilePage";

export default function Profile() {
  return (
    <div>
      <DashboardHeader title="Welcome  Nayon" />
      <div className="p-6">
        <ProfilePage />
      </div>
    </div>
  );
}
