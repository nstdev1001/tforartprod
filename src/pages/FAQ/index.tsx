import { Button } from "@/components/ui/button";
import { companyInfo } from "@/pages/CompanyInfo/companyInfoData";
import { faqData, FaqItem } from "@/pages/FAQ/FAQdata";
import { useState } from "react";

const FAQItem = ({ question, answer }: FaqItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 py-4">
      <Button
        variant={"ghost"}
        className="flex justify-between items-start md:items-center w-full text-left font-medium text-gray-100 focus:outline-none h-auto py-3 px-2 md:px-4 hover:bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base md:text-lg whitespace-normal break-words flex-1 pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 mt-0.5 md:mt-0 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </Button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="whitespace-pre-line text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = ({ title, faqs }: { title: string; faqs: FaqItem[] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-4">
        {title}
      </h2>
      <div className="space-y-1">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

const TforartFAQ = () => {
  return (
    <div className="faq-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[150px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          CÂU HỎI THƯỜNG GẶP (FAQ)
        </h1>
        <p className="text-base md:text-lg text-gray-400">
          Tìm hiểu thêm về TFORART COMPANY LIMITED và dịch vụ của chúng tôi
        </p>
      </div>

      <div className="space-y-8">
        {faqData.map((section, index) => (
          <FAQSection
            key={index}
            title={section.title}
            faqs={section.items.map((item) => ({
              question: item.question,
              answer: item.answer,
            }))}
          />
        ))}
      </div>

      <div className="mt-12 text-center p-6 bg-black rounded-lg">
        <h3 className="text-lg font-medium text-gray-100 mb-2">
          Bạn có câu hỏi nào khác?
        </h3>
        <p className="text-gray-100 mb-4">
          Vui lòng liên hệ với chúng tôi qua:
        </p>
        <div className="space-y-1 text-gray-300">
          <p>Email: {companyInfo.email}</p>
          <p>Điện thoại: {companyInfo.phoneNumber}</p>
          <p>Địa chỉ: {companyInfo.address}</p>
        </div>
      </div>
    </div>
  );
};

export default TforartFAQ;
