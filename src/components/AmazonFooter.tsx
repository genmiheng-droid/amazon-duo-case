import React from 'react';

interface AmazonFooterProps {
  onBackToTop: () => void;
  onResetHome: () => void;
}

export const AmazonFooter: React.FC<AmazonFooterProps> = ({ onBackToTop, onResetHome }) => {
  const columns = [
    {
      title: 'Get to Know Us',
      links: ['About Amazon', 'Careers', 'Amazon Science', 'Sustainability'],
    },
    {
      title: 'Make Money with Us',
      links: [
        'Sell on Amazon',
        'Advertise Your Products',
        'Protect & Build Your Brand',
        'Supply to Amazon',
      ],
    },
    {
      title: 'Amazon Payment Products',
      links: ['Shop with Points', 'Gift Cards', 'Amazon Currency Converter'],
    },
    {
      title: 'Let Us Help You',
      links: [
        'Your Account',
        'Your Orders',
        'Shipping Rates & Policies',
        'Returns & Replacements',
        'Help',
      ],
    },
  ];

  return (
    <footer className="mt-10 text-white">
      <button
        type="button"
        onClick={onBackToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-3.5 text-[13px] font-medium text-center transition-colors"
      >
        Back to top
      </button>

      <div className="bg-[#232f3e] border-b border-[#3a4553]">
        <div className="max-w-[1040px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[15px] font-bold mb-2.5 text-white">{col.title}</h3>
              <ul className="space-y-1.5 text-[13px] text-[#dddddd]">
                {col.links.map((label) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={onResetHome}
                      className="text-left hover:underline"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#131921] py-7 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          <button
            type="button"
            onClick={onResetHome}
            className="flex items-baseline text-white font-bold text-[19px] tracking-tight"
          >
            amazon<span className="text-[12px] font-medium">.sg</span>
          </button>
          <div className="flex items-center gap-2 text-[12px] text-[#cccccc]">
            <span className="px-3 py-1 border border-[#848688] rounded-[3px]">
              English
            </span>
            <span className="px-3 py-1 border border-[#848688] rounded-[3px]">
              SGD - Singapore Dollar
            </span>
            <span className="px-3 py-1 border border-[#848688] rounded-[3px]">
              Singapore
            </span>
          </div>
        </div>
        <p className="text-[11px] text-[#cccccc]">
          Conditions of Use &amp; Sale &nbsp;&middot;&nbsp; Privacy Notice &nbsp;&middot;&nbsp; Singapore Consumer Protection
        </p>
      </div>
    </footer>
  );
};
