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
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Hosts 文件管理器
              </h1>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* 监控状态 */}
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="mr-2">
                {systemConfig?.serviceRunning ? (
                  <span className="h-3 w-3 rounded-full bg-green-500 inline-block animate-pulse"></span>
                ) : (
                  <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">监控状态</span>
                <span className="text-sm font-medium">
                  {systemConfig?.serviceRunning ? "已启动" : "未启动"}
                </span>
              </div>
            </div>
            
            {/* 权限状态 */}
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="mr-2">
                {systemConfig?.adminRights ? (
                  <span className="h-3 w-3 rounded-full bg-blue-500 inline-block"></span>
                ) : (
                  <span className="h-3 w-3 rounded-full bg-gray-400 inline-block"></span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">权限状态</span>
                <span className="text-sm font-medium">
                  {systemConfig?.adminRights ? "管理员权限" : "普通权限"}
                </span>
              </div>
            </div>
            
            {/* 最近修复 */}
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">最近修复</span>
                <span className="text-sm font-medium truncate" title={formattedLastRepair}>
                  {formattedLastRepair}
                </span>
              </div>
            </div>
            
            {/* 规则冲突 */}
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="mr-2">
                {conflicts.hasConflicts ? (
                  <span className="h-3 w-3 rounded-full bg-red-500 inline-block animate-pulse"></span>
                ) : (
                  <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">规则冲突</span>
                <span className={`text-sm font-medium truncate ${conflicts.hasConflicts ? 'text-red-600' : 'text-green-600'}`} 
                      title={conflicts.hasConflicts ? conflicts.conflicts[0] : "无冲突"}>
                  {conflicts.hasConflicts ? conflicts.conflicts[0] : "无"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
