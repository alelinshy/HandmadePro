import { useHostsContext } from "@/contexts/HostsContext";
import { formatDate } from "@/lib/utils";

export function MonitorStatus() {
  const { systemConfig, conflicts } = useHostsContext();
  
  // Format the last repair time
  const formattedLastRepair = systemConfig?.lastRepair 
    ? `${formatDate(new Date(systemConfig.lastRepair))} (${systemConfig.lastRepairRule || 'Unknown'})`
    : '无';
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 h-full">
      <h3 className="text-sm font-semibold text-indigo-700 mb-4 border-b border-indigo-100 pb-2">系统监控状态</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 监控状态 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-indigo-100">
          <div className="mr-3 flex items-center justify-center bg-indigo-50 h-8 w-8 rounded-full">
            {systemConfig?.serviceRunning ? (
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block animate-pulse"></span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-indigo-500">服务状态</span>
            <span className="text-sm font-medium">
              {systemConfig?.serviceRunning ? "已启动" : "未启动"}
            </span>
          </div>
        </div>
        
        {/* 权限状态 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-indigo-100">
          <div className="mr-3 flex items-center justify-center bg-indigo-50 h-8 w-8 rounded-full">
            {systemConfig?.adminRights ? (
              <span className="h-3 w-3 rounded-full bg-blue-500 inline-block"></span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-gray-400 inline-block"></span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-indigo-500">权限状态</span>
            <span className="text-sm font-medium">
              {systemConfig?.adminRights ? "管理员权限" : "普通权限"}
            </span>
          </div>
        </div>
        
        {/* 最近修复 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-indigo-100">
          <div className="mr-3 flex items-center justify-center bg-indigo-50 h-8 w-8 rounded-full">
            <span className="text-indigo-400 text-xs font-medium">最近</span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-indigo-500">修复操作</span>
            <span className="text-sm font-medium truncate" title={formattedLastRepair}>
              {formattedLastRepair}
            </span>
          </div>
        </div>
        
        {/* 规则冲突 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-indigo-100">
          <div className="mr-3 flex items-center justify-center bg-indigo-50 h-8 w-8 rounded-full">
            {conflicts.hasConflicts ? (
              <span className="h-3 w-3 rounded-full bg-red-500 inline-block animate-pulse"></span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-indigo-500">规则冲突</span>
            <span className={`text-sm font-medium truncate ${conflicts.hasConflicts ? 'text-red-600' : 'text-green-600'}`} 
                  title={conflicts.hasConflicts ? conflicts.conflicts[0] : "无冲突"}>
              {conflicts.hasConflicts ? conflicts.conflicts[0] : "无"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}