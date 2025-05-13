import { useHostsContext } from "@/contexts/HostsContext";
import { formatDate } from "@/lib/utils";

export function MonitorStatus() {
  const { systemConfig, conflicts } = useHostsContext();
  
  // Format the last repair time
  const formattedLastRepair = systemConfig?.lastRepair 
    ? `${formatDate(new Date(systemConfig.lastRepair))} (${systemConfig.lastRepairRule || 'Unknown'})`
    : '无';
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-5 h-full border border-indigo-100">
      <h3 className="text-sm font-semibold text-indigo-700 mb-4 border-b border-indigo-100 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-indigo-500">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
          <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
          <path d="M12 12l4.3 4.3"></path>
          <path d="M12 12l-4.3 4.3"></path>
        </svg>
        系统监控状态
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 监控状态 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all">
          <div className="mr-3 flex items-center justify-center bg-indigo-100 h-10 w-10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            {systemConfig?.serviceRunning ? (
              <span className="absolute h-3 w-3 rounded-full bg-green-500 animate-pulse right-0 top-0 mr-2 mt-2"></span>
            ) : (
              <span className="absolute h-3 w-3 rounded-full bg-red-500 right-0 top-0 mr-2 mt-2"></span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-indigo-500">服务状态</span>
            <span className="text-sm font-semibold">
              {systemConfig?.serviceRunning ? "已启动" : "未启动"}
            </span>
          </div>
        </div>
        
        {/* 权限状态 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all">
          <div className="mr-3 flex items-center justify-center bg-indigo-100 h-10 w-10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            {systemConfig?.adminRights ? (
              <span className="absolute h-3 w-3 rounded-full bg-blue-500 right-0 top-0 mr-2 mt-2"></span>
            ) : (
              <span className="absolute h-3 w-3 rounded-full bg-gray-400 right-0 top-0 mr-2 mt-2"></span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-indigo-500">权限状态</span>
            <span className="text-sm font-semibold">
              {systemConfig?.adminRights ? "管理员权限" : "普通权限"}
            </span>
          </div>
        </div>
        
        {/* 最近修复 - 使用完整宽度 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all col-span-1 md:col-span-2">
          <div className="mr-3 flex items-center justify-center bg-indigo-100 h-10 w-10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-indigo-500">最近修复</span>
            <span className="text-sm font-semibold" title={formattedLastRepair}>
              {formattedLastRepair}
            </span>
          </div>
        </div>
        
        {/* 规则冲突 - 使用完整宽度 */}
        <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all col-span-1 md:col-span-2">
          <div className="mr-3 flex items-center justify-center bg-indigo-100 h-10 w-10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {conflicts.hasConflicts ? (
              <span className="absolute h-3 w-3 rounded-full bg-red-500 animate-pulse right-0 top-0 mr-2 mt-2"></span>
            ) : (
              <span className="absolute h-3 w-3 rounded-full bg-green-500 right-0 top-0 mr-2 mt-2"></span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <span className="text-xs font-medium text-indigo-500">规则冲突</span>
            <div className={`text-sm font-semibold ${conflicts.hasConflicts ? 'text-red-600' : 'text-green-600'}`}>
              {conflicts.hasConflicts 
                ? <div className="max-h-20 overflow-y-auto">
                    {conflicts.conflicts.map((conflict, index) => (
                      <div key={index} className="mb-1">{conflict}</div>
                    ))}
                  </div>
                : "无冲突"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}