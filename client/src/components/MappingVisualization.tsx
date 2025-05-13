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
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <h2 className="text-lg font-medium text-gray-900 mb-4">映射可视化</h2>
      
      <div className="overflow-y-auto scroll-table mb-4" style={{ maxHeight: "calc(100vh - 500px)", minHeight: "150px" }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">域名</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属规则</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeMappings.length > 0 ? (
              activeMappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{mapping.ipAddress}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{mapping.domain}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {getRuleNameById(mapping.ruleId)}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  没有活动的映射记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-auto flex items-center justify-between px-2">
        <span className="text-xs text-gray-500">
          显示 <span className="font-medium">{activeMappings.length}</span> 条活动映射记录
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isApplyingRules}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          刷新
        </Button>
      </div>
    </div>
  );
}
