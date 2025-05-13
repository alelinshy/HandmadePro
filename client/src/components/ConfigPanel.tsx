import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHostsContext } from "@/contexts/HostsContext";
import { Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ConfigPanel() {
  const { 
    systemConfig, 
    updateSystemConfig, 
    elevatePermissions, 
    openHostsFile,
    isElevatingPermissions,
    isOpeningHostsFile,
    isUpdatingSystemConfig
  } = useHostsContext();
  
  const { toast } = useToast();
  const [repairDelay, setRepairDelay] = useState<number>(systemConfig?.repairDelay || 500);
  
  const handleAutoStartChange = (checked: boolean) => {
    updateSystemConfig({ autoStart: checked });
  };
  
  const handleMinimizeToTrayChange = (checked: boolean) => {
    updateSystemConfig({ minimizeToTray: checked });
  };
  
  const handleElevatePermissions = () => {
    elevatePermissions();
  };
  
  const handleOpenHostsFile = () => {
    openHostsFile();
  };
  
  const handleApplyRepairDelay = () => {
    if (repairDelay < 0 || repairDelay > 10000) {
      toast({
        title: "无效的延迟值",
        description: "延迟值必须在 0-10000 毫秒之间",
        variant: "destructive"
      });
      return;
    }
    
    updateSystemConfig({ repairDelay });
    toast({
      title: "修复延迟已更新",
      description: `已设置为 ${repairDelay} 毫秒`
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">应用设置</h3>
          
          {/* 开机自启 */}
          <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-md">
            <Label htmlFor="autoStart" className="text-sm text-gray-600">开机自启</Label>
            <Switch
              id="autoStart"
              checked={systemConfig?.autoStart || false}
              onCheckedChange={handleAutoStartChange}
              disabled={isUpdatingSystemConfig}
            />
          </div>
          
          {/* 启动时最小化到托盘 */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <Label htmlFor="minimizeToTray" className="text-sm text-gray-600">启动时最小化到托盘</Label>
            <Switch
              id="minimizeToTray"
              checked={systemConfig?.minimizeToTray || false}
              onCheckedChange={handleMinimizeToTrayChange}
              disabled={isUpdatingSystemConfig}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">系统操作</h3>
          
          <div className="flex flex-col h-full justify-center gap-3">
            {/* 权限提升按钮 */}
            <Button 
              variant={systemConfig?.adminRights ? "outline" : "default"}
              onClick={handleElevatePermissions}
              disabled={systemConfig?.adminRights || isElevatingPermissions}
              className="text-sm h-10 transition-all hover:shadow-md"
            >
              <Shield className={`h-4 w-4 mr-2 ${systemConfig?.adminRights ? 'text-green-500' : ''}`} />
              {systemConfig?.adminRights ? '已获取管理员权限' : '权限提升'}
            </Button>
            
            {/* 打开Hosts文件 */}
            <Button 
              variant="outline"
              onClick={handleOpenHostsFile}
              disabled={isOpeningHostsFile}
              className="text-sm h-10 transition-all hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              打开Hosts文件
            </Button>
          </div>
        </div>
        
        {/* 修复延迟 */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">性能设置</h3>
          
          <Label htmlFor="repairDelay" className="block text-sm text-gray-600 mb-2">
            修复延迟 (ms)
          </Label>
          <div className="flex">
            <Input
              id="repairDelay"
              type="number"
              value={repairDelay}
              onChange={(e) => setRepairDelay(parseInt(e.target.value) || 0)}
              min={0}
              max={10000}
              className="shadow-sm focus:ring-2 focus:ring-blue-200 block w-full sm:text-sm rounded-md h-10"
            />
            <Button 
              className="ml-2"
              size="default"
              onClick={handleApplyRepairDelay}
              disabled={isUpdatingSystemConfig}
            >
              应用
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-md">
            设置Hosts文件修复操作的延迟时间
          </p>
        </div>
      </div>
    </div>
  );
}
