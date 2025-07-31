"use client";
import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./ChangePassword";
import NotificationSettings from "./NotificationSettings";
import AboutPage from "./AboutPage";
import TermsPage from "./TermsPage";

export type SettingsSection =
  | "profile"
  | "general"
  | "security"
  | "notifications"
  | "about"
  | "terms";

export default function SettingsLayout() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
     
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "about":
        return <AboutPage />;
      case "terms":
        return <TermsPage />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/4">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      <div className="lg:w-3/4">
        <div className="bg-white rounded-lg shadow-sm border border-primary/30">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
