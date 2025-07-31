import React from "react";
import { FileText, ExternalLink } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-gray-700" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Terms & Privacy
          </h3>
          <p className="text-gray-600">Legal information and policies</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="#"
            className="flex items-center justify-between p-4 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Terms of Service</h4>
              <p className="text-sm text-gray-600">Our terms and conditions</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-4 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Privacy Policy</h4>
              <p className="text-sm text-gray-600">How we handle your data</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-4 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Cookie Policy</h4>
              <p className="text-sm text-gray-600">Our cookie usage policy</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-4 border border-primary/30 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-600">Download your data</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        </div>

        {/* Summary Sections */}
        <div className="space-y-6">
          <div className="border border-primary/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Privacy Summary
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                We are committed to protecting your privacy and personal data.
                Here's what you should know:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    We collect only necessary information to provide our
                    services
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Your data is encrypted and stored securely</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    We never sell or share your personal information with third
                    parties
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You can request data deletion at any time</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border border-primary/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Terms Summary
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <p>By using our service, you agree to the following key terms:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Use the service responsibly and lawfully</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Respect other users and their content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Don't share your account credentials</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>We may update these terms with notice</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border border-primary/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Contact & Support
            </h4>
            <p className="text-sm text-gray-700 mb-4">
              If you have questions about our terms or privacy practices, please
              contact us:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">legal@yourapp.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">Dhaka, Bangladesh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">July 31, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
