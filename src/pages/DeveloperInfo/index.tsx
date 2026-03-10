// src/pages/DeveloperInfoPage.tsx

import { developerInfo } from "./developerInfo";
import { Github, Mail, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

const DeveloperInfoPage = () => {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-[20px] md:p-[50px] pt-[70px]">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl shadow-black shadow-lg p-8 text-center">
        <div className="mb-6">
          <img
            src={developerInfo.avatarPath}
            alt="Developer Avatar"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-zinc-700"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            {developerInfo.name}
          </h1>
          <p className="text-zinc-400 mb-4">{developerInfo.role}</p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-md font-semibold mb-4 text-white">
            Thông tin liên hệ hợp tác hoặc báo lỗi:
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="mr-3 text-blue-500" size={24} />
              <Link
                to={`mailto:${developerInfo.contactInfo.email}`}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {developerInfo.contactInfo.email}
              </Link>
            </div>
            <div className="flex items-center">
              <Phone className="mr-3 text-green-500" size={24} />
              <Link
                to={`tel:${developerInfo.contactInfo.phone}`}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {developerInfo.contactInfo.phone}
              </Link>
            </div>
            <div className="flex items-center">
              <Github className="mr-3 text-zinc-200" size={24} />
              <Link
                to={developerInfo.contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                GitHub Support
              </Link>
            </div>
            <div className="flex items-center">
              <Send className="mr-3 text-purple-500" size={24} />
              <Link
                to={developerInfo.contactInfo.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Messenger
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            {developerInfo.supportMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfoPage;
