import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { useHostsContext } from "@/contexts/HostsContext";
import { EditRuleDialog } from "@/components/EditRuleDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function RuleManagement() {
  const { 
    rules, 
    createRule, 
    updateRule, 
    deleteRule,
    isCreatingRule,
    isUpdatingRule,
    isDeletingRule
  } = useHostsContext();
  
  const { toast } = useToast();
  const [newRuleName, setNewRuleName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  
  const handleAddRule = () => {
    if (newRuleName.trim() === "") {
      toast({
        title: "规则名称不能为空",
        variant: "destructive"
      });
      return;
    }
    
    createRule({ name: newRuleName, enabled: true });
    setNewRuleName("");
  };
  
  const handleToggleRule = (id: number, enabled: boolean) => {
    updateRule({ id, rule: { enabled } });
  };
  
  const handleEditClick = (id: number) => {
    setSelectedRuleId(id);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = (id: number) => {
    setSelectedRuleId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedRuleId !== null) {
      deleteRule(selectedRuleId);
      setDeleteDialogOpen(false);
    }
  };
  
  // Find selected rule for edit dialog
  const selectedRule = selectedRuleId !== null 
    ? rules.find(rule => rule.id === selectedRuleId) 
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <h2 className="text-lg font-medium text-gray-900 mb-4">规则管理</h2>
      
      <div className="overflow-y-auto flex-1 mb-4">
        <ul className="divide-y divide-gray-200">
          {rules.map((rule) => (
            <li key={rule.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-2">
                  <Switch
                    id={`rule-${rule.id}`}
                    checked={rule.enabled}
                    onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                    size="sm"
                    disabled={isUpdatingRule}
                  />
                </div>
                <span className={`text-sm font-medium ${rule.enabled ? 'text-primary' : 'text-gray-500'}`}>
                  {rule.name}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEditClick(rule.id)}
                  disabled={isUpdatingRule}
                >
                  <Pencil className="h-5 w-5 text-gray-500 hover:text-primary" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteClick(rule.id)}
                  disabled={isDeletingRule}
                >
                  <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto">
        <div className="flex">
          <Input
            placeholder="规则名称"
            value={newRuleName}
            onChange={(e) => setNewRuleName(e.target.value)}
            className="rounded-r-none"
          />
          <Button 
            onClick={handleAddRule}
            disabled={isCreatingRule || !newRuleName}
            className="rounded-l-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加规则
          </Button>
        </div>
      </div>
      
      {/* Edit Rule Dialog */}
      {selectedRule && (
        <EditRuleDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          rule={selectedRule}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除规则</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除规则及其所有映射，且无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
