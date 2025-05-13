import { useHostsContext } from "@/contexts/HostsContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MappingVisualization() {
  const { 
    activeMappings, 
    getRuleNameById, 
    applyRules, 
    isApplyingRules 
  } = useHostsContext();
  
  const handleRefresh = () => {
    applyRules();
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md border border-blue-100 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-100">
        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">映射可视化</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isApplyingRules}
          className="text-xs h-9 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${isApplyingRules ? 'animate-spin text-blue-500' : 'text-blue-500'}`} />
          {isApplyingRules ? '更新中...' : '应用规则'}
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-1 mb-4 rounded-lg border border-blue-100 shadow-inner">
        {activeMappings.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-blue-100">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 shadow-sm">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">IP地址</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">域名</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">所属规则</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {activeMappings.map((mapping) => (
                  <tr key={mapping.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-indigo-800">{mapping.ipAddress}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-blue-800 font-mono">{mapping.domain}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                      <Badge className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 hover:shadow-sm transition-all border border-indigo-200 px-3 py-1">
                        {getRuleNameById(mapping.ruleId)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-gradient-to-br from-blue-50 to-indigo-50 h-full rounded-lg">
            <div className="w-20 h-20 mb-4 rounded-full bg-white shadow-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <p className="text-lg font-medium text-indigo-800">没有活动的映射记录</p>
            <p className="text-sm mt-1 text-blue-700 max-w-xs">请在规则管理中添加并启用规则，然后点击"应用规则"按钮</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-3 border-t border-blue-100 flex items-center justify-between">
        <div className="bg-blue-50 px-3 py-1.5 rounded-md text-xs font-medium text-blue-700 shadow-sm">
          显示 <span className="font-bold text-indigo-800">{activeMappings.length}</span> 条活动映射记录
        </div>
        <div className="bg-blue-50 px-3 py-1.5 rounded-md text-xs font-medium text-blue-700 shadow-sm">
          {activeMappings.length > 0 && (
            <>来自 <span className="font-bold text-indigo-800">{new Set(activeMappings.map(m => m.ruleId)).size}</span> 个规则</>
          )}
        </div>
      </div>
    </div>
  );
}
