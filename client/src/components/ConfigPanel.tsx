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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-50">
          <h3 className="text-sm font-semibold text-indigo-700 mb-4 pb-2 border-b border-indigo-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-indigo-500">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            应用设置
          </h3>
          
          {/* 开机自启 */}
          <div className="flex items-center justify-between mb-4 bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-colors">
            <Label htmlFor="autoStart" className="text-sm text-indigo-700 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-indigo-500">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              开机自启
            </Label>
            <Switch
              id="autoStart"
              checked={systemConfig?.autoStart || false}
              onCheckedChange={handleAutoStartChange}
              disabled={isUpdatingSystemConfig}
            />
          </div>
          
          {/* 启动时最小化到托盘 */}
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-colors">
            <Label htmlFor="minimizeToTray" className="text-sm text-indigo-700 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-indigo-500">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M12 16h.01"></path>
              </svg>
              最小化到托盘
            </Label>
            <Switch
              id="minimizeToTray"
              checked={systemConfig?.minimizeToTray || false}
              onCheckedChange={handleMinimizeToTrayChange}
              disabled={isUpdatingSystemConfig}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-50">
          <h3 className="text-sm font-semibold text-indigo-700 mb-4 pb-2 border-b border-indigo-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-indigo-500">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            系统操作
          </h3>
          
          <div className="flex flex-col h-full justify-center gap-4">
            {/* 权限提升按钮 */}
            <Button 
              variant={systemConfig?.adminRights ? "outline" : "default"}
              onClick={handleElevatePermissions}
              disabled={systemConfig?.adminRights || isElevatingPermissions}
              className="text-sm h-11 transition-all hover:shadow-md rounded-lg"
            >
              <Shield className={`h-5 w-5 mr-2 ${systemConfig?.adminRights ? 'text-green-500' : ''}`} />
              {systemConfig?.adminRights ? '已获取管理员权限' : '权限提升'}
            </Button>
            
            {/* 打开Hosts文件 */}
            <Button 
              variant="outline"
              onClick={handleOpenHostsFile}
              disabled={isOpeningHostsFile}
              className="text-sm h-11 transition-all hover:bg-indigo-50 rounded-lg border-indigo-200"
            >
              <FileText className="h-5 w-5 mr-2 text-indigo-500" />
              打开Hosts文件
            </Button>
          </div>
        </div>
        
        {/* 修复延迟 */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-50">
          <h3 className="text-sm font-semibold text-indigo-700 mb-4 pb-2 border-b border-indigo-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-indigo-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="6" x2="12" y2="12"></line>
              <line x1="12" y1="12" x2="16" y2="16"></line>
            </svg>
            性能设置
          </h3>
          
          <Label htmlFor="repairDelay" className="block text-sm text-indigo-700 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-indigo-500">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
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
              className="shadow-sm focus:ring-2 focus:ring-indigo-300 block w-full sm:text-sm rounded-lg h-11 border-indigo-200"
            />
            <Button 
              className="ml-2 bg-indigo-600 hover:bg-indigo-700"
              size="default"
              onClick={handleApplyRepairDelay}
              disabled={isUpdatingSystemConfig}
            >
              应用
            </Button>
          </div>
          <p className="text-xs text-indigo-600 mt-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            设置Hosts文件修复操作的延迟时间，建议值为500ms
          </p>
        </div>
      </div>
    </div>
  );
}
