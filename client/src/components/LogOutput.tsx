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
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 border-t border-gray-700 p-4 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">系统日志</h2>
          <div className="bg-gray-700 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 shadow-inner border border-gray-600">
            <span className="text-white">共</span> {logs.length} <span className="text-white">条日志</span>
          </div>
        </div>
        <div 
          ref={logContainerRef}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-md shadow-md p-4 overflow-y-auto font-mono border border-gray-700"
          style={{ height: "180px" }}
        >
          {logs.length > 0 ? (
            <pre className="text-sm whitespace-pre-wrap">
              {logs.map((log) => (
                <div key={log.id} className="mb-2 pb-2 border-b border-gray-800 last:border-0">
                  <span className="text-blue-400 font-semibold">[{formatDateTime(new Date(log.timestamp))}]</span>{" "}
                  <span className="text-emerald-300">{log.message}</span>
                </div>
              ))}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 border border-gray-700 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">正在等待系统日志...</p>
              <p className="text-gray-500 text-xs mt-1">操作系统时将会记录活动信息</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
