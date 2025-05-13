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
    <div className="md:col-span-1 bg-white rounded-lg shadow p-4 flex flex-col">
      <h2 className="text-lg font-medium text-gray-900 mb-4">配置面板</h2>
      
      {/* 开机自启 */}
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="autoStart" className="text-sm font-medium text-gray-700">开机自启</Label>
        <Switch
          id="autoStart"
          checked={systemConfig?.autoStart || false}
          onCheckedChange={handleAutoStartChange}
          disabled={isUpdatingSystemConfig}
        />
      </div>
      
      {/* 启动时最小化到托盘 */}
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="minimizeToTray" className="text-sm font-medium text-gray-700">启动时最小化到托盘</Label>
        <Switch
          id="minimizeToTray"
          checked={systemConfig?.minimizeToTray || false}
          onCheckedChange={handleMinimizeToTrayChange}
          disabled={isUpdatingSystemConfig}
        />
      </div>
      
      {/* 权限提升按钮 */}
      <Button 
        className="mb-4"
        onClick={handleElevatePermissions}
        disabled={systemConfig?.adminRights || isElevatingPermissions}
      >
        <Shield className="h-5 w-5 mr-2" />
        权限提升
      </Button>
      
      {/* 打开Hosts文件 */}
      <Button 
        className="mb-4"
        variant="outline"
        onClick={handleOpenHostsFile}
        disabled={isOpeningHostsFile}
      >
        <FileText className="h-5 w-5 mr-2" />
        打开Hosts文件
      </Button>
      
      {/* 修复延迟 */}
      <div className="mb-4">
        <Label htmlFor="repairDelay" className="block text-sm font-medium text-gray-700 mb-1">修复延迟 (ms)</Label>
        <div className="flex">
          <Input
            id="repairDelay"
            type="number"
            value={repairDelay}
            onChange={(e) => setRepairDelay(parseInt(e.target.value))}
            min={0}
            max={10000}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm rounded-md"
          />
          <Button 
            className="ml-2"
            size="sm"
            onClick={handleApplyRepairDelay}
            disabled={isUpdatingSystemConfig}
          >
            应用
          </Button>
        </div>
      </div>
    </div>
  );
}
