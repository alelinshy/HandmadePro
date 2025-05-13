import { useEffect } from "react";
import { StatusBar } from "@/components/StatusBar";
import { ConfigPanel } from "@/components/ConfigPanel";
import { RuleManagement } from "@/components/RuleManagement";
import { MappingVisualization } from "@/components/MappingVisualization";
import { LogOutput } from "@/components/LogOutput";
import { MonitorStatus } from "@/components/MonitorStatus";
import { useHostsContext } from "@/contexts/HostsContext";

export default function Home() {
  const { refetchConflicts, applyRules } = useHostsContext();
  
  // Periodically check for conflicts
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchConflicts();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchConflicts]);
  
  // Apply rules when a rule is toggled
  useEffect(() => {
    // Wait for any rule changes to settle, then apply rules
    const timerId = setTimeout(() => {
      applyRules();
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [applyRules]);
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* 顶部区域: 状态栏 */}
      <StatusBar />
      
      {/* 配置面板和监控状态 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex">
          <div className="flex-1">
            <ConfigPanel />
          </div>
          <div className="ml-4 w-[450px] flex-shrink-0">
            <MonitorStatus />
          </div>
        </div>
      </div>
      
      {/* 中间区域：规则管理和映射可视化 */}
      <main className="flex-1 overflow-hidden p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RuleManagement />
          <MappingVisualization />
        </div>
      </main>
      
      {/* 底部区域: 日志输出 */}
      <LogOutput />
    </div>
  );
}
