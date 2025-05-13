import { useHostsContext } from "@/contexts/HostsContext";
import { formatDate } from "@/lib/utils";

export function StatusBar() {
  const { systemConfig, conflicts } = useHostsContext();
  
  // Format the last repair time
  const formattedLastRepair = systemConfig?.lastRepair 
    ? `${formatDate(new Date(systemConfig.lastRepair))} (${systemConfig.lastRepairRule || 'Unknown'})`
    : '无';
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gradient-primary">
                Hosts 文件管理器
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
