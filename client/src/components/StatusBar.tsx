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
              <h1 className="text-xl font-semibold text-gray-900">Hosts 文件管理器</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            {/* 监控状态 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">监控状态:</span>
              {systemConfig?.serviceRunning ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  已启动
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                  未启动
                </span>
              )}
            </div>
            
            {/* 权限状态 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">权限状态:</span>
              {systemConfig?.adminRights ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  管理员权限
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  普通权限
                </span>
              )}
            </div>
            
            {/* 最近修复 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">最近修复:</span>
              <span className="text-sm text-gray-600">{formattedLastRepair}</span>
            </div>
            
            {/* 规则冲突 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">规则冲突:</span>
              {conflicts.hasConflicts ? (
                <span className="text-sm text-red-600">{conflicts.conflicts[0]}</span>
              ) : (
                <span className="text-sm text-green-600">无</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
