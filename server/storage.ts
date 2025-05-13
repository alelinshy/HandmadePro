import { 
  hostRules, type HostRule, type InsertHostRule,
  hostMappings, type HostMapping, type InsertHostMapping,
  systemConfig, type SystemConfig, type InsertSystemConfig,
  logEntries, type LogEntry, type InsertLogEntry
} from "@shared/schema";
import fs from "fs";
import path from "path";
import os from "os";
import { log } from "./vite";

// Storage interface
export interface IStorage {
  // Host Rules
  getAllRules(): Promise<HostRule[]>;
  getRuleById(id: number): Promise<HostRule | undefined>;
  createRule(rule: InsertHostRule): Promise<HostRule>;
  updateRule(id: number, rule: Partial<InsertHostRule>): Promise<HostRule | undefined>;
  deleteRule(id: number): Promise<boolean>;
  
  // Host Mappings
  getAllMappings(): Promise<HostMapping[]>;
  getMappingsByRuleId(ruleId: number): Promise<HostMapping[]>;
  createMapping(mapping: InsertHostMapping): Promise<HostMapping>;
  updateMapping(id: number, mapping: Partial<InsertHostMapping>): Promise<HostMapping | undefined>;
  deleteMapping(id: number): Promise<boolean>;
  deleteMappingsByRuleId(ruleId: number): Promise<boolean>;
  
  // System Config
  getSystemConfig(): Promise<SystemConfig>;
  updateSystemConfig(config: Partial<InsertSystemConfig>): Promise<SystemConfig>;
  
  // Logs
  getAllLogs(): Promise<LogEntry[]>;
  getLatestLogs(limit: number): Promise<LogEntry[]>;
  createLog(log: InsertLogEntry): Promise<LogEntry>;
  
  // Hosts File Operations
  readHostsFile(): Promise<string>;
  writeHostsFile(content: string): Promise<boolean>;
  applyRulesToHostsFile(): Promise<boolean>;
  
  // System Operations
  checkAdminRights(): Promise<boolean>;
  getHostsFilePath(): string;
  getCurrentConflicts(): Promise<{ hasConflicts: boolean, conflicts: string[] }>;
}

export class MemStorage implements IStorage {
  private rules: Map<number, HostRule>;
  private mappings: Map<number, HostMapping>;
  private config: SystemConfig;
  private logs: Map<number, LogEntry>;
  
  private ruleCurrentId: number;
  private mappingCurrentId: number;
  private logCurrentId: number;
  
  constructor() {
    this.rules = new Map();
    this.mappings = new Map();
    this.logs = new Map();
    
    this.ruleCurrentId = 1;
    this.mappingCurrentId = 1;
    this.logCurrentId = 1;
    
    // Initialize with default system config
    this.config = {
      id: 1,
      autoStart: false,
      minimizeToTray: false,
      repairDelay: 500,
      lastRepair: null,
      lastRepairRule: null,
      serviceRunning: true,
      adminRights: false,
      fontFamily: 'system-ui',
      fontSize: '14px'
    };
    
    // Add some initial log entries
    this.createLog({
      timestamp: new Date(),
      message: "正在启动 Hosts 文件管理器..."
    });
    
    // Check admin rights on startup
    this.checkAdminRights().then(isAdmin => {
      this.config.adminRights = isAdmin;
      this.createLog({
        timestamp: new Date(),
        message: `已以${isAdmin ? '管理员' : '普通用户'}权限启动`
      });
    });
  }
  
  // Host Rules
  async getAllRules(): Promise<HostRule[]> {
    return Array.from(this.rules.values());
  }
  
  async getRuleById(id: number): Promise<HostRule | undefined> {
    return this.rules.get(id);
  }
  
  async createRule(rule: InsertHostRule): Promise<HostRule> {
    const id = this.ruleCurrentId++;
    const newRule: HostRule = { ...rule, id };
    this.rules.set(id, newRule);
    
    this.createLog({
      timestamp: new Date(),
      message: `创建规则: "${rule.name}"`
    });
    
    return newRule;
  }
  
  async updateRule(id: number, rule: Partial<InsertHostRule>): Promise<HostRule | undefined> {
    const existingRule = this.rules.get(id);
    if (!existingRule) return undefined;
    
    const updatedRule = { ...existingRule, ...rule };
    this.rules.set(id, updatedRule);
    
    this.createLog({
      timestamp: new Date(),
      message: `更新规则: "${existingRule.name}"`
    });
    
    return updatedRule;
  }
  
  async deleteRule(id: number): Promise<boolean> {
    const rule = this.rules.get(id);
    if (!rule) return false;
    
    // Delete rule and all its mappings
    this.rules.delete(id);
    await this.deleteMappingsByRuleId(id);
    
    this.createLog({
      timestamp: new Date(),
      message: `删除规则: "${rule.name}"`
    });
    
    return true;
  }
  
  // Host Mappings
  async getAllMappings(): Promise<HostMapping[]> {
    return Array.from(this.mappings.values());
  }
  
  async getMappingsByRuleId(ruleId: number): Promise<HostMapping[]> {
    return Array.from(this.mappings.values()).filter(
      mapping => mapping.ruleId === ruleId
    );
  }
  
  async createMapping(mapping: InsertHostMapping): Promise<HostMapping> {
    const id = this.mappingCurrentId++;
    const newMapping: HostMapping = { ...mapping, id };
    this.mappings.set(id, newMapping);
    return newMapping;
  }
  
  async updateMapping(id: number, mapping: Partial<InsertHostMapping>): Promise<HostMapping | undefined> {
    const existingMapping = this.mappings.get(id);
    if (!existingMapping) return undefined;
    
    const updatedMapping = { ...existingMapping, ...mapping };
    this.mappings.set(id, updatedMapping);
    return updatedMapping;
  }
  
  async deleteMapping(id: number): Promise<boolean> {
    return this.mappings.delete(id);
  }
  
  async deleteMappingsByRuleId(ruleId: number): Promise<boolean> {
    const mappingsToDelete = Array.from(this.mappings.values())
      .filter(mapping => mapping.ruleId === ruleId);
    
    for (const mapping of mappingsToDelete) {
      this.mappings.delete(mapping.id);
    }
    
    return true;
  }
  
  // System Config
  async getSystemConfig(): Promise<SystemConfig> {
    return this.config;
  }
  
  async updateSystemConfig(config: Partial<InsertSystemConfig>): Promise<SystemConfig> {
    this.config = { ...this.config, ...config };
    return this.config;
  }
  
  // Logs
  async getAllLogs(): Promise<LogEntry[]> {
    return Array.from(this.logs.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getLatestLogs(limit: number): Promise<LogEntry[]> {
    return (await this.getAllLogs()).slice(0, limit);
  }
  
  async createLog(logEntry: InsertLogEntry): Promise<LogEntry> {
    const id = this.logCurrentId++;
    const newLog: LogEntry = { ...logEntry, id };
    this.logs.set(id, newLog);
    log(logEntry.message);
    return newLog;
  }
  
  // Hosts File Operations
  getHostsFilePath(): string {
    // Return appropriate hosts file path based on OS
    if (os.platform() === 'win32') {
      return 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    } else {
      return '/etc/hosts';
    }
  }
  
  async readHostsFile(): Promise<string> {
    const hostsPath = this.getHostsFilePath();
    try {
      return fs.readFileSync(hostsPath, 'utf8');
    } catch (error) {
      this.createLog({
        timestamp: new Date(),
        message: `读取 Hosts 文件失败: ${(error as Error).message}`
      });
      return '';
    }
  }
  
  async writeHostsFile(content: string): Promise<boolean> {
    const hostsPath = this.getHostsFilePath();
    try {
      // Check if we have write access
      await this.checkAdminRights();
      if (!this.config.adminRights) {
        this.createLog({
          timestamp: new Date(),
          message: "写入 Hosts 文件失败: 需要管理员权限"
        });
        return false;
      }
      
      fs.writeFileSync(hostsPath, content, 'utf8');
      this.createLog({
        timestamp: new Date(),
        message: "已成功写入 Hosts 文件"
      });
      return true;
    } catch (error) {
      this.createLog({
        timestamp: new Date(),
        message: `写入 Hosts 文件失败: ${(error as Error).message}`
      });
      return false;
    }
  }
  
  async applyRulesToHostsFile(): Promise<boolean> {
    try {
      // Get all enabled rules and their mappings
      const rules = (await this.getAllRules()).filter(rule => rule.enabled);
      let hostsContent = await this.readHostsFile();
      
      // Split hosts file by lines, keeping only system entries
      let hostsLines = hostsContent.split('\n');
      const systemEntries = hostsLines.filter(line => 
        !line.includes('# HOSTS-MANAGER-START') && 
        !line.includes('# HOSTS-MANAGER-END') &&
        !line.includes('# Rule:')
      );
      
      // Create new content with our managed entries
      const managedEntries: string[] = [];
      managedEntries.push('# HOSTS-MANAGER-START');
      
      for (const rule of rules) {
        const mappings = await this.getMappingsByRuleId(rule.id);
        if (mappings.length > 0) {
          managedEntries.push(`# Rule: ${rule.name}`);
          for (const mapping of mappings) {
            managedEntries.push(`${mapping.ipAddress}\t${mapping.domain}`);
          }
        }
      }
      
      managedEntries.push('# HOSTS-MANAGER-END');
      
      // Combine system entries with managed entries
      const newContent = [...systemEntries, '', ...managedEntries].join('\n');
      
      // Write to hosts file
      const result = await this.writeHostsFile(newContent);
      
      if (result) {
        // Update last repair info
        const now = new Date();
        const lastRule = rules.length > 0 ? rules[0].name : null;
        await this.updateSystemConfig({
          lastRepair: now,
          lastRepairRule: lastRule
        });
      }
      
      return result;
    } catch (error) {
      this.createLog({
        timestamp: new Date(),
        message: `应用规则到 Hosts 文件失败: ${(error as Error).message}`
      });
      return false;
    }
  }
  
  async checkAdminRights(): Promise<boolean> {
    try {
      // A simple check: try to access the hosts file for writing
      const hostsPath = this.getHostsFilePath();
      fs.accessSync(hostsPath, fs.constants.W_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async getCurrentConflicts(): Promise<{ hasConflicts: boolean, conflicts: string[] }> {
    const conflicts: string[] = [];
    const domainMap = new Map<string, { rule: string, ip: string }>();
    
    // Get all enabled rules
    const rules = (await this.getAllRules()).filter(rule => rule.enabled);
    
    // Check for conflicts
    for (const rule of rules) {
      const mappings = await this.getMappingsByRuleId(rule.id);
      
      for (const mapping of mappings) {
        if (domainMap.has(mapping.domain)) {
          const existing = domainMap.get(mapping.domain)!;
          if (existing.ip !== mapping.ipAddress) {
            conflicts.push(`"${rule.name}" 与 "${existing.rule}" 存在冲突: 域名 ${mapping.domain}`);
          }
        } else {
          domainMap.set(mapping.domain, { rule: rule.name, ip: mapping.ipAddress });
        }
      }
    }
    
    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }
}

export const storage = new MemStorage();
