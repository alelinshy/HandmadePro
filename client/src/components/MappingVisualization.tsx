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
    <div className="bg-white rounded-lg shadow p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="text-lg font-bold text-gray-900">映射可视化</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isApplyingRules}
          className="text-xs h-8"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isApplyingRules ? 'animate-spin' : ''}`} />
          {isApplyingRules ? '更新中...' : '应用规则'}
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-1 mb-4 rounded-lg border">
        {activeMappings.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP地址</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">域名</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">所属规则</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {activeMappings.map((mapping) => (
                  <tr key={mapping.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{mapping.ipAddress}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{mapping.domain}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                        {getRuleNameById(mapping.ruleId)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-gray-50 h-full rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <p className="text-lg font-medium">没有活动的映射记录</p>
            <p className="text-sm mt-1">请在规则管理中添加并启用规则</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-2 border-t flex items-center justify-between text-xs text-gray-500">
        <div>
          显示 <span className="font-medium">{activeMappings.length}</span> 条活动映射记录
        </div>
        <div>
          {activeMappings.length > 0 && (
            <>来自 <span className="font-medium">{new Set(activeMappings.map(m => m.ruleId)).size}</span> 个规则</>
          )}
        </div>
      </div>
    </div>
  );
}
