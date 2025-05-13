import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useHostsContext } from "@/contexts/HostsContext";
import { type HostRule, type HostMapping } from "@shared/schema";

interface EditRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: HostRule;
}

export function EditRuleDialog({ open, onOpenChange, rule }: EditRuleDialogProps) {
  const { 
    updateRule, 
    allMappings, 
    createMapping, 
    updateMapping, 
    deleteMapping,
    isUpdatingRule,
    isCreatingMapping,
    isUpdatingMapping,
    isDeletingMapping
  } = useHostsContext();
  
  const [ruleName, setRuleName] = useState(rule.name);
  const [enabled, setEnabled] = useState(rule.enabled);
  const [mappings, setMappings] = useState<(HostMapping | { id?: number, ruleId: number, ipAddress: string, domain: string })[]>([]);
  
  // Load mappings for this rule when dialog opens
  useEffect(() => {
    if (open) {
      const ruleMappings = allMappings.filter(m => m.ruleId === rule.id);
      setMappings(ruleMappings.length > 0 ? ruleMappings : [{ ruleId: rule.id, ipAddress: '', domain: '' }]);
      setRuleName(rule.name);
      setEnabled(rule.enabled);
    }
  }, [open, rule, allMappings]);
  
  const handleSave = async () => {
    // Update rule name and enabled status
    await updateRule({ 
      id: rule.id, 
      rule: { name: ruleName, enabled } 
    });
    
    // Process mappings
    for (const mapping of mappings) {
      if (!mapping.ipAddress || !mapping.domain) continue;
      
      if ('id' in mapping && mapping.id) {
        // Update existing mapping
        await updateMapping({
          id: mapping.id,
          mapping: { ipAddress: mapping.ipAddress, domain: mapping.domain }
        });
      } else {
        // Create new mapping
        await createMapping({
          ruleId: rule.id,
          ipAddress: mapping.ipAddress,
          domain: mapping.domain
        });
      }
    }
    
    // Close dialog
    onOpenChange(false);
  };
  
  const handleAddMapping = () => {
    setMappings([...mappings, { ruleId: rule.id, ipAddress: '', domain: '' }]);
  };
  
  const handleRemoveMapping = async (index: number) => {
    const mapping = mappings[index];
    if ('id' in mapping && mapping.id) {
      // Delete from database if it's an existing mapping
      await deleteMapping(mapping.id);
    }
    
    // Remove from state
    setMappings(mappings.filter((_, i) => i !== index));
  };
  
  const handleMappingChange = (index: number, field: 'ipAddress' | 'domain', value: string) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };
  
  const isFormValid = () => {
    if (!ruleName.trim()) return false;
    
    // Check if all non-empty mappings have both IP and domain
    for (const mapping of mappings) {
      const ipFilled = !!mapping.ipAddress.trim();
      const domainFilled = !!mapping.domain.trim();
      
      // If one field is filled but not the other, form is invalid
      if ((ipFilled && !domainFilled) || (!ipFilled && domainFilled)) {
        return false;
      }
    }
    
    return true;
  };
  
  const isLoading = isUpdatingRule || isCreatingMapping || isUpdatingMapping || isDeletingMapping;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>编辑规则</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="editRuleName" className="block text-sm font-medium text-gray-700 mb-1">规则名称</Label>
            <Input
              id="editRuleName"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">映射条目</Label>
            <div className="bg-gray-50 p-3 rounded-md max-h-64 overflow-y-auto mb-3">
              {mappings.map((mapping, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    placeholder="IP地址"
                    value={mapping.ipAddress}
                    onChange={(e) => handleMappingChange(index, 'ipAddress', e.target.value)}
                    className="w-1/3 rounded-r-none"
                    disabled={isLoading}
                  />
                  <Input
                    placeholder="域名"
                    value={mapping.domain}
                    onChange={(e) => handleMappingChange(index, 'domain', e.target.value)}
                    className="w-2/3 rounded-l-none"
                    disabled={isLoading}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="ml-2 rounded-full"
                    onClick={() => handleRemoveMapping(index)}
                    disabled={isLoading || mappings.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMapping}
                className="mt-2"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-1" />
                添加映射
              </Button>
            </div>
          </div>
          
          <div className="flex items-center">
            <Switch
              id="ruleEnabled"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={isLoading}
            />
            <Label htmlFor="ruleEnabled" className="ml-2">
              启用规则
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !isFormValid()}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
