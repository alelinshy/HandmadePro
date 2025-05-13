import { createContext, useContext, ReactNode } from "react";
import { useHostsManager } from "@/hooks/use-hosts-manager";

// Create context with the return type of useHostsManager
type HostsContextType = ReturnType<typeof useHostsManager>;

const HostsContext = createContext<HostsContextType | null>(null);

interface HostsProviderProps {
  children: ReactNode;
}

export function HostsProvider({ children }: HostsProviderProps) {
  const hostsManager = useHostsManager();
  
  return (
    <HostsContext.Provider value={hostsManager}>
      {children}
    </HostsContext.Provider>
  );
}

export function useHostsContext() {
  const context = useContext(HostsContext);
  
  if (!context) {
    throw new Error("useHostsContext must be used within a HostsProvider");
  }
  
  return context;
}
