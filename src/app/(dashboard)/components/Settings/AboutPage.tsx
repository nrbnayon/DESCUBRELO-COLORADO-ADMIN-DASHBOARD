import React from "react";
import { Info, ExternalLink, Heart, Github, Twitter } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Info className="w-6 h-6 text-gray-700" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">About</h3>
          <p className="text-gray-600">Application information and details</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* App Info */}
        <div className="border border-primary/30 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-full flex justify-center items-center">
              {" "}
              <Image src="/logo.png" alt="logo" width={200} height={200} />
            </div>
            {/* <h2 className="text-2xl font-bold text-gray-900">
              DESCUBRELO COLORADO
            </h2> */}
            <p className="text-gray-600">Version 1.0.0</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Build Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build:</span>
                  <span className="font-mono">#2025.08.01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-mono">Production</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tech Stack</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frontend:</span>
                  <span>Next.js latest, React Native latest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Styling:</span>
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Icons:</span>
                  <span>Lucide React</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Modern UI/UX</h5>
                <p className="text-sm text-gray-600">
                  Clean, responsive design with dark mode support
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Real-time Updates</h5>
                <p className="text-sm text-gray-600">
                  Live notifications and data synchronization
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Secure & Private</h5>
                <p className="text-sm text-gray-600">
                  End-to-end encryption and privacy protection
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-900">Cross-platform</h5>
                <p className="text-sm text-gray-600">
                  Works seamlessly on all devices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border border-primary/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Links & Resources
          </h4>
          <div className="space-y-3">
            <a
              href="#"
              className="flex items-center justify-between p-3 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Documentation</span>
              </div>
              <span className="text-gray-500">→</span>
            </a>

            <a
              href="#"
              className="flex items-center justify-between p-3 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Source Code</span>
              </div>
              <span className="text-gray-500">→</span>
            </a>

            <a
              href="#"
              className="flex items-center justify-between p-3 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">
                  Follow Updates
                </span>
              </div>
              <span className="text-gray-500">→</span>
            </a>
          </div>
        </div>

        {/* Credits */}
        <div className="border border-primary/30 rounded-lg p-6">
          <div className="text-center">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-gray-600">
              Made with love by{" "}
              <span className="font-semibold text-gray-900">Nayon</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              © 2024 Your App Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
