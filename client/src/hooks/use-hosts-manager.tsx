import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  type HostRule, 
  type HostMapping, 
  type SystemConfig, 
  type LogEntry
} from "@shared/schema";

export function useHostsManager() {
  const { toast } = useToast();
  
  // System Config
  const { 
    data: systemConfig,
    isLoading: isLoadingConfig
  } = useQuery<SystemConfig>({
    queryKey: ['/api/system/config'],
  });
  
  // Update System Config
  const updateSystemConfigMutation = useMutation({
    mutationFn: async (config: Partial<SystemConfig>) => {
      await apiRequest('PATCH', '/api/system/config', config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system/config'] });
    },
    onError: (error) => {
      toast({
        title: "更新配置失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Elevate Permissions
  const elevatePermissionsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/system/elevate');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system/config'] });
      toast({
        title: "权限提升成功",
        description: "已获取管理员权限",
      });
    },
    onError: (error) => {
      toast({
        title: "权限提升失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Open Hosts File
  const openHostsFileMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/system/open-hosts');
    },
    onError: (error) => {
      toast({
        title: "打开Hosts文件失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Rules
  const {
    data: rules = [],
    isLoading: isLoadingRules
  } = useQuery<HostRule[]>({
    queryKey: ['/api/rules'],
  });
  
  // Create Rule
  const createRuleMutation = useMutation({
    mutationFn: async (rule: { name: string, enabled?: boolean }) => {
      const response = await apiRequest('POST', '/api/rules', rule);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
      toast({
        title: "规则创建成功",
      });
    },
    onError: (error) => {
      toast({
        title: "创建规则失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Update Rule
  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, rule }: { id: number, rule: Partial<HostRule> }) => {
      const response = await apiRequest('PATCH', `/api/rules/${id}`, rule);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mappings'] });
      toast({
        title: "规则更新成功",
      });
    },
    onError: (error) => {
      toast({
        title: "更新规则失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Delete Rule
  const deleteRuleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/rules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mappings'] });
      toast({
        title: "规则删除成功",
      });
    },
    onError: (error) => {
      toast({
        title: "删除规则失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Mappings
  const {
    data: allMappings = [],
    isLoading: isLoadingMappings
  } = useQuery<HostMapping[]>({
    queryKey: ['/api/mappings'],
  });
  
  // Create Mapping
  const createMappingMutation = useMutation({
    mutationFn: async (mapping: { ruleId: number, ipAddress: string, domain: string }) => {
      const response = await apiRequest('POST', '/api/mappings', mapping);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mappings'] });
    },
    onError: (error) => {
      toast({
        title: "创建映射失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Update Mapping
  const updateMappingMutation = useMutation({
    mutationFn: async ({ id, mapping }: { id: number, mapping: Partial<HostMapping> }) => {
      const response = await apiRequest('PATCH', `/api/mappings/${id}`, mapping);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mappings'] });
    },
    onError: (error) => {
      toast({
        title: "更新映射失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Delete Mapping
  const deleteMappingMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/mappings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mappings'] });
    },
    onError: (error) => {
      toast({
        title: "删除映射失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Apply Rules to Hosts File
  const applyRulesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/hosts/apply');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system/config'] });
      toast({
        title: "规则应用成功",
        description: "已成功应用规则到Hosts文件",
      });
    },
    onError: (error) => {
      toast({
        title: "应用规则失败",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Get Conflicts
  const {
    data: conflicts = { hasConflicts: false, conflicts: [] },
    isLoading: isLoadingConflicts,
    refetch: refetchConflicts
  } = useQuery<{ hasConflicts: boolean, conflicts: string[] }>({
    queryKey: ['/api/hosts/conflicts'],
  });
  
  // Logs
  const {
    data: logs = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery<LogEntry[]>({
    queryKey: ['/api/logs'],
  });
  
  // Filter mappings for enabled rules
  const getActiveMappings = useCallback(() => {
    const enabledRules = rules.filter(rule => rule.enabled).map(rule => rule.id);
    return allMappings.filter(mapping => enabledRules.includes(mapping.ruleId));
  }, [rules, allMappings]);
  
  // Get rule name by ID
  const getRuleNameById = useCallback((ruleId: number) => {
    const rule = rules.find(r => r.id === ruleId);
    return rule ? rule.name : 'Unknown';
  }, [rules]);
  
  // Loading state
  const isLoading = isLoadingConfig || isLoadingRules || isLoadingMappings || isLoadingLogs || isLoadingConflicts;
  
  return {
    // Data
    systemConfig,
    rules,
    allMappings,
    activeMappings: getActiveMappings(),
    logs,
    conflicts,
    isLoading,
    
    // Helper
    getRuleNameById,
    
    // Actions
    updateSystemConfig: updateSystemConfigMutation.mutate,
    elevatePermissions: elevatePermissionsMutation.mutate,
    openHostsFile: openHostsFileMutation.mutate,
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    deleteRule: deleteRuleMutation.mutate,
    createMapping: createMappingMutation.mutate,
    updateMapping: updateMappingMutation.mutate,
    deleteMapping: deleteMappingMutation.mutate,
    applyRules: applyRulesMutation.mutate,
    refetchConflicts,
    refetchLogs,
    
    // Mutation states
    isUpdatingSystemConfig: updateSystemConfigMutation.isPending,
    isElevatingPermissions: elevatePermissionsMutation.isPending,
    isOpeningHostsFile: openHostsFileMutation.isPending,
    isCreatingRule: createRuleMutation.isPending,
    isUpdatingRule: updateRuleMutation.isPending,
    isDeletingRule: deleteRuleMutation.isPending,
    isCreatingMapping: createMappingMutation.isPending,
    isUpdatingMapping: updateMappingMutation.isPending,
    isDeletingMapping: deleteMappingMutation.isPending,
    isApplyingRules: applyRulesMutation.isPending,
  };
}
