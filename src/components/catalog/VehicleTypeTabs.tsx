import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleType } from '@/models/TruckTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { getEnabledTypes, getCategoryName } from '@/lib/generated/categories';

interface VehicleTypeTabsProps {
  selectedType: VehicleType;
  onTypeChange: (value: VehicleType) => void;
}

type TabInfo = {
  value: VehicleType;
  label: string;
  color: string;
  border: string;
  bg: string;
};

// Xây tab động từ registry danh mục, giữ style cho 4 danh mục chính
const getTabs = (): TabInfo[] => {
  const styleByKey: Record<string, Pick<TabInfo, 'color'|'border'|'bg'>> = {
    'xe-tai': { color: 'text-blue-800', border: 'border-blue-400', bg: 'bg-blue-100' },
    'xe-cau': { color: 'text-orange-700', border: 'border-orange-400', bg: 'bg-orange-100' },
    'mooc': { color: 'text-purple-700', border: 'border-purple-400', bg: 'bg-purple-100' },
    'dau-keo': { color: 'text-red-700', border: 'border-red-400', bg: 'bg-red-100' },
  };
  return getEnabledTypes().map((key) => {
    const style = styleByKey[key] || { color: 'text-gray-700', border: 'border-gray-300', bg: 'bg-gray-100' };
    return {
      value: key as VehicleType,
      label: getCategoryName(key),
      ...style,
    };
  });
};

const VehicleTypeTabs: React.FC<VehicleTypeTabsProps> = ({ selectedType, onTypeChange }) => {
  const isMobile = useIsMobile();

  const tabsToRender = getTabs();

  const handleTabChange = (value: string) => {
    onTypeChange(value as VehicleType);
  };

  // MOBILE: hiển thị dạng lưới dễ bấm
  if (isMobile) {
    return (
      <div className="w-full flex justify-center mb-3 px-1">
        <div
          className="w-full mx-auto"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(tabsToRender.length, 4)}, minmax(0, 1fr))` }}
        >
          {tabsToRender.map((tab, idx) => {
            const isActive = selectedType === tab.value;
            const radius =
              idx === 0
                ? 'rounded-l-xl'
                : idx === tabsToRender.length - 1
                ? 'rounded-r-xl'
                : '';
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`py-3 rounded-none font-bold text-base transition-all border-2
                  ${radius}
                  ${isActive ? `shadow-lg ${tab.color} ${tab.bg} ${tab.border}` : 'bg-gray-50 text-gray-700 border-transparent'}
                `}
                style={{ minWidth: 0, width: '100%' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // DESKTOP: tab giãn đều 4 phần, nền sáng, nổi bật hẳn với phần nội dung dưới
  return (
    <div
      className="w-full mb-4 px-1"
    >
      <div
        className="w-full rounded-2xl shadow-lg border-none"
        style={{
          // Gradient xanh nhạt.
          background: 'linear-gradient(90deg, #eaf4fb 0%, #f9fdff 100%)',
          boxShadow: '0 4px 16px 0 rgba(60,124,167,0.10)',
        }}
      >
        <Tabs
          value={selectedType}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList
            className="
              flex w-full p-0 overflow-hidden rounded-2xl bg-transparent
              "
          >
            {tabsToRender.map((tab, idx) => {
              const isActive = selectedType === tab.value;
              // Bo tròn đầu và cuối thanh tab
              const radius =
                idx === 0
                  ? 'rounded-l-2xl'
                  : idx === tabsToRender.length - 1
                  ? 'rounded-r-2xl'
                  : '';
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
                    flex-1 flex items-center justify-center py-4 px-2 font-bold text-base
                    border-none transition-all duration-200
                    relative z-10
                    ${radius}
                    ${isActive
                      ? `bg-white shadow-lg text-primary ${tab.border} border-b-4 ${tab.color}`
                      : 'text-gray-700 bg-transparent hover:bg-blue-50'
                    }
                    whitespace-nowrap
                  `}
                  style={{
                    // Tách nhẹ các tab
                    marginLeft: idx !== 0 ? '-1px' : 0,
                    borderBottom: isActive ? '4px solid #60a5fa' : '4px solid transparent',
                  }}
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleTypeTabs;
