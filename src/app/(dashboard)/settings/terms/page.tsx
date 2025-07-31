import React from "react";
import DashboardHeader from "../../components/dashboard-header";
import SettingsLayout from "../../components/Settings/SettingsLayout";

export default function SettingsPage() {
  return (
    <div>
      <DashboardHeader title="Settings" />
      <div className="p-6">
        <SettingsLayout />
      </div>
    </div>
  );
}
