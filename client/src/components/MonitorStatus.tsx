import { useHostsContext } from "@/contexts/HostsContext";
import { formatDate } from "@/lib/utils";

export function MonitorStatus() {
  const { systemConfig, conflicts } = useHostsContext();
  
  // Format the last repair time
  const formattedLastRepair = systemConfig?.lastRepair 
    ? `${formatDate(new Date(systemConfig.lastRepair))} (${systemConfig.lastRepairRule || 'Unknown'})`
    : '无';
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">监控状态</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* 监控状态 */}
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <div className="mr-3">
            {systemConfig?.serviceRunning ? (
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block animate-pulse"></span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500">服务状态</span>
            <span className="text-sm font-medium">
              {systemConfig?.serviceRunning ? "已启动" : "未启动"}
            </span>
          </div>
        </div>
        
        {/* 权限状态 */}
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <div className="mr-3">
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
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-gray-500">最近修复</span>
            <span className="text-sm font-medium truncate" title={formattedLastRepair}>
              {formattedLastRepair}
            </span>
          </div>
        </div>
        
        {/* 规则冲突 */}
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <div className="mr-3">
            {conflicts.hasConflicts ? (
              <span className="h-3 w-3 rounded-full bg-red-500 inline-block animate-pulse"></span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-gray-500">规则冲突</span>
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