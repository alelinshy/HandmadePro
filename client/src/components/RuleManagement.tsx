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
    <div className="bg-white rounded-lg shadow p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="text-lg font-bold text-gray-900">规则管理</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          共 {rules.length} 条规则
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 mb-4 pr-1">
        {rules.length > 0 ? (
          <ul className="space-y-2">
            {rules.map((rule) => (
              <li 
                key={rule.id} 
                className={`p-3 flex justify-between items-center rounded-lg border ${
                  rule.enabled 
                    ? 'border-blue-100 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <Switch
                      id={`rule-${rule.id}`}
                      checked={rule.enabled}
                      onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                      disabled={isUpdatingRule}
                    />
                  </div>
                  <span className={`font-medium ${
                    rule.enabled 
                      ? 'text-blue-800' 
                      : 'text-gray-500'
                  }`}>
                    {rule.name}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => handleEditClick(rule.id)}
                    disabled={isUpdatingRule}
                  >
                    <Pencil className={`h-4 w-4 ${rule.enabled ? 'text-blue-600' : 'text-gray-500'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full hover:bg-red-100"
                    onClick={() => handleDeleteClick(rule.id)}
                    disabled={isDeletingRule}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-lg h-40">
            <p>尚无规则</p>
            <p className="text-sm mt-1">点击下方按钮添加规则</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-2 border-t">
        <div className="flex">
          <Input
            placeholder="规则名称"
            value={newRuleName}
            onChange={(e) => setNewRuleName(e.target.value)}
            className="rounded-r-none border-gray-300 focus:border-blue-300"
          />
          <Button 
            onClick={handleAddRule}
            disabled={isCreatingRule || !newRuleName}
            className="rounded-l-none bg-gradient-primary"
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
