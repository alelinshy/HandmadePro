import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertHostRuleSchema, 
  insertHostMappingSchema, 
  insertSystemConfigSchema 
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { execSync } from 'child_process';
import os from 'os';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Helper for handling validation errors
  const validateRequest = (schema: z.ZodType<any>, data: any) => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return { success: false, error: validationError.message };
      }
      return { success: false, error: 'Invalid request data' };
    }
  };

  // System Configuration
  app.get('/api/system/config', async (_req, res) => {
    try {
      const config = await storage.getSystemConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.patch('/api/system/config', async (req, res) => {
    try {
      const validation = validateRequest(insertSystemConfigSchema.partial(), req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const config = await storage.updateSystemConfig(validation.data);
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Privilege Elevation
  app.post('/api/system/elevate', async (_req, res) => {
    try {
      // This is a simulated elevation in the context of a web app
      // In a real desktop app, you'd use native OS mechanisms to elevate privileges
      const isAdmin = await storage.checkAdminRights();
      
      if (isAdmin) {
        await storage.updateSystemConfig({ adminRights: true });
        await storage.createLog({
          timestamp: new Date(),
          message: "已提升为管理员权限"
        });
        res.json({ success: true, adminRights: true });
      } else {
        await storage.createLog({
          timestamp: new Date(),
          message: "权限提升失败"
        });
        res.json({ success: false, message: "无法提升权限" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Open Hosts File
  app.post('/api/system/open-hosts', async (_req, res) => {
    try {
      const hostsPath = storage.getHostsFilePath();
      let command = '';
      
      // Different commands based on OS
      if (os.platform() === 'win32') {
        command = `notepad "${hostsPath}"`;
      } else if (os.platform() === 'darwin') {
        command = `open -e "${hostsPath}"`;
      } else {
        // Linux and others
        command = `xdg-open "${hostsPath}"`;
      }
      
      try {
        execSync(command);
        await storage.createLog({
          timestamp: new Date(),
          message: "已打开 Hosts 文件"
        });
        res.json({ success: true });
      } catch (err) {
        await storage.createLog({
          timestamp: new Date(),
          message: `打开 Hosts 文件失败: ${(err as Error).message}`
        });
        res.status(500).json({ message: (err as Error).message });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Host Rules
  app.get('/api/rules', async (_req, res) => {
    try {
      const rules = await storage.getAllRules();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/rules/:id', async (req, res) => {
    try {
      const ruleId = parseInt(req.params.id);
      const rule = await storage.getRuleById(ruleId);
      
      if (!rule) {
        return res.status(404).json({ message: "Rule not found" });
      }
      
      res.json(rule);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post('/api/rules', async (req, res) => {
    try {
      const validation = validateRequest(insertHostRuleSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const rule = await storage.createRule(validation.data);
      res.status(201).json(rule);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.patch('/api/rules/:id', async (req, res) => {
    try {
      const ruleId = parseInt(req.params.id);
      const validation = validateRequest(insertHostRuleSchema.partial(), req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const rule = await storage.updateRule(ruleId, validation.data);
      
      if (!rule) {
        return res.status(404).json({ message: "Rule not found" });
      }
      
      res.json(rule);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.delete('/api/rules/:id', async (req, res) => {
    try {
      const ruleId = parseInt(req.params.id);
      const success = await storage.deleteRule(ruleId);
      
      if (!success) {
        return res.status(404).json({ message: "Rule not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Host Mappings
  app.get('/api/mappings', async (_req, res) => {
    try {
      const mappings = await storage.getAllMappings();
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/rules/:ruleId/mappings', async (req, res) => {
    try {
      const ruleId = parseInt(req.params.ruleId);
      const mappings = await storage.getMappingsByRuleId(ruleId);
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post('/api/mappings', async (req, res) => {
    try {
      const validation = validateRequest(insertHostMappingSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const mapping = await storage.createMapping(validation.data);
      res.status(201).json(mapping);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.patch('/api/mappings/:id', async (req, res) => {
    try {
      const mappingId = parseInt(req.params.id);
      const validation = validateRequest(insertHostMappingSchema.partial(), req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const mapping = await storage.updateMapping(mappingId, validation.data);
      
      if (!mapping) {
        return res.status(404).json({ message: "Mapping not found" });
      }
      
      res.json(mapping);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.delete('/api/mappings/:id', async (req, res) => {
    try {
      const mappingId = parseInt(req.params.id);
      const success = await storage.deleteMapping(mappingId);
      
      if (!success) {
        return res.status(404).json({ message: "Mapping not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Host file operations
  app.post('/api/hosts/apply', async (_req, res) => {
    try {
      const success = await storage.applyRulesToHostsFile();
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to apply rules to hosts file" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/hosts/conflicts', async (_req, res) => {
    try {
      const conflicts = await storage.getCurrentConflicts();
      res.json(conflicts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Logs
  app.get('/api/logs', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getLatestLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return httpServer;
}
