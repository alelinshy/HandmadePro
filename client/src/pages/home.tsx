import { useEffect } from "react";
import { StatusBar } from "@/components/StatusBar";
import { ConfigPanel } from "@/components/ConfigPanel";
import { RuleManagement } from "@/components/RuleManagement";
import { MappingVisualization } from "@/components/MappingVisualization";
import { LogOutput } from "@/components/LogOutput";
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
      <StatusBar />
      
      <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <ConfigPanel />
        
        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RuleManagement />
          <MappingVisualization />
        </div>
      </main>
      
      <LogOutput />
    </div>
  );
}
