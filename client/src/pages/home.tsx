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
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 顶部区域: 状态栏 */}
      <StatusBar />
      
      {/* 配置面板和监控状态 */}
      <div className="p-5 border-b border-indigo-100 bg-white bg-opacity-70 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-[350px] flex-shrink-0">
              <MonitorStatus />
            </div>
            <div className="flex-1">
              <ConfigPanel />
            </div>
          </div>
        </div>
      </div>
      
      {/* 中间区域：规则管理和映射可视化 */}
      <main className="flex-1 overflow-hidden p-5 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RuleManagement />
            <MappingVisualization />
          </div>
        </div>
      </main>
      
      {/* 底部区域: 日志输出 */}
      <div className="bg-white bg-opacity-70 backdrop-blur-sm border-t border-indigo-100 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <LogOutput />
        </div>
      </div>
    </div>
  );
}
