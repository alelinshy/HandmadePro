import { useEffect, useRef } from "react";
import { useHostsContext } from "@/contexts/HostsContext";
import { formatDateTime } from "@/lib/utils";

export function LogOutput() {
  const { logs } = useHostsContext();
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">日志输出</h2>
          <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-500">
            共 {logs.length} 条日志
          </div>
        </div>
        <div 
          ref={logContainerRef}
          className="bg-gray-900 rounded-md shadow-sm p-3 overflow-y-auto font-mono"
          style={{ height: "180px" }}
        >
          {logs.length > 0 ? (
            <pre className="text-sm whitespace-pre-wrap">
              {logs.map((log) => (
                <div key={log.id} className="mb-1">
                  <span className="text-gray-400">[{formatDateTime(new Date(log.timestamp))}]</span>{" "}
                  <span className="text-green-300">{log.message}</span>
                </div>
              ))}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              系统日志将在这里显示
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
