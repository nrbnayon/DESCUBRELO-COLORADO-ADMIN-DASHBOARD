"use client";

import React, { useState } from "react";
import { Bell, Save } from "lucide-react";

// Define the structure of your notification settings
type NotificationCategory = "email" | "push" | "sms";

type NotificationSettingsType = {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    comments: boolean;
  };
  push: {
    messages: boolean;
    mentions: boolean;
    updates: boolean;
    marketing: boolean;
  };
  sms: {
    security: boolean;
    marketing: boolean;
  };
};

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationSettingsType>({
    email: {
      marketing: true,
      security: true,
      updates: false,
      comments: true,
    },
    push: {
      messages: true,
      mentions: true,
      updates: false,
      marketing: false,
    },
    sms: {
      security: true,
      marketing: false,
    },
  });

  const handleToggle = (category: NotificationCategory, key: string) => {
    setNotifications((prev) => {
      const currentCategory = prev[category] as Record<string, boolean>;
      return {
        ...prev,
        [category]: {
          ...currentCategory,
          [key]: !currentCategory[key],
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notification settings updated:", notifications);
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-6 h-6 text-gray-700" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Notification Settings
          </h3>
          <p className="text-gray-600">Choose how you want to be notified</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Notifications */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Email Notifications
          </h4>
          <div className="space-y-4">
            {Object.entries(notifications.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900 capitalize">
                    {key === "marketing"
                      ? "Marketing & Promotions"
                      : key === "security"
                      ? "Security Alerts"
                      : key === "updates"
                      ? "Product Updates"
                      : "Comments & Replies"}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {key === "marketing"
                      ? "Receive promotional emails and offers"
                      : key === "security"
                      ? "Get notified about security events"
                      : key === "updates"
                      ? "News about new features and updates"
                      : "When someone comments or replies"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("email", key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Push Notifications
          </h4>
          <div className="space-y-4">
            {Object.entries(notifications.push).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900 capitalize">
                    {key === "messages"
                      ? "New Messages"
                      : key === "mentions"
                      ? "Mentions & Tags"
                      : key === "updates"
                      ? "App Updates"
                      : "Marketing"}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {key === "messages"
                      ? "Get notified when you receive new messages"
                      : key === "mentions"
                      ? "When someone mentions or tags you"
                      : key === "updates"
                      ? "Notifications about app updates"
                      : "Promotional push notifications"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("push", key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            SMS Notifications
          </h4>
          <div className="space-y-4">
            {Object.entries(notifications.sms).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900 capitalize">
                    {key === "security"
                      ? "Security Alerts"
                      : "Marketing Messages"}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {key === "security"
                      ? "Important security notifications via SMS"
                      : "Promotional SMS messages"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("sms", key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
