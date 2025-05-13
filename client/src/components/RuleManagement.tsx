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
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-md border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">规则管理</h2>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full shadow-sm">
          共 {rules.length} 条规则
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 mb-4 pr-1">
        {rules.length > 0 ? (
          <ul className="space-y-3">
            {rules.map((rule) => (
              <li 
                key={rule.id} 
                className={`p-3.5 flex justify-between items-center rounded-lg border shadow-sm transition-all duration-200 ${
                  rule.enabled 
                    ? 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 hover:shadow-md' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <Switch
                      id={`rule-${rule.id}`}
                      checked={rule.enabled}
                      onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                      disabled={isUpdatingRule}
                      className={rule.enabled ? "data-[state=checked]:bg-indigo-600" : ""}
                    />
                  </div>
                  <span className={`font-medium ${
                    rule.enabled 
                      ? 'text-indigo-800' 
                      : 'text-gray-500'
                  }`}>
                    {rule.name}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-9 w-9 p-0 rounded-full hover:bg-white hover:shadow-sm transition-all ${rule.enabled ? 'hover:text-indigo-600' : ''}`}
                    onClick={() => handleEditClick(rule.id)}
                    disabled={isUpdatingRule}
                  >
                    <Pencil className={`h-4 w-4 ${rule.enabled ? 'text-indigo-500' : 'text-gray-500'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 rounded-full hover:bg-red-50 hover:shadow-sm transition-all"
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
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="w-16 h-16 mb-3 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="font-medium text-indigo-800">尚无规则</p>
            <p className="text-sm mt-1 max-w-xs">点击下方按钮添加规则来管理你的hosts文件</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className="flex shadow-sm rounded-md overflow-hidden">
          <Input
            placeholder="输入规则名称..."
            value={newRuleName}
            onChange={(e) => setNewRuleName(e.target.value)}
            className="rounded-r-none border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 h-11"
          />
          <Button 
            onClick={handleAddRule}
            disabled={isCreatingRule || !newRuleName}
            className="rounded-l-none bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-5 h-11 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
