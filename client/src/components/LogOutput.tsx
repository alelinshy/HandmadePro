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
    <footer className="bg-gray-100 border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-2">日志输出</h2>
        <div 
          ref={logContainerRef}
          className="bg-white rounded-md shadow-sm p-3 overflow-y-auto font-mono"
          style={{ height: "180px" }}
        >
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {logs.map((log) => (
              <div key={log.id}>
                [{formatDateTime(new Date(log.timestamp))}] {log.message}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </footer>
  );
}
