import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Host Rule Schema
export const hostRules = pgTable("host_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  enabled: boolean("enabled").notNull().default(true),
});

// Host Mapping Schema
export const hostMappings = pgTable("host_mappings", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").notNull().references(() => hostRules.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address").notNull(),
  domain: text("domain").notNull(),
});

// System Config Schema
export const systemConfig = pgTable("system_config", {
  id: serial("id").primaryKey(),
  autoStart: boolean("auto_start").notNull().default(false),
  minimizeToTray: boolean("minimize_to_tray").notNull().default(false),
  repairDelay: integer("repair_delay").notNull().default(500),
  lastRepair: timestamp("last_repair"),
  lastRepairRule: text("last_repair_rule"),
  serviceRunning: boolean("service_running").notNull().default(false),
  adminRights: boolean("admin_rights").notNull().default(false),
});

// Log Schema
export const logEntries = pgTable("log_entries", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  message: text("message").notNull(),
});

// Insert Schemas
export const insertHostRuleSchema = createInsertSchema(hostRules).omit({ id: true });
export const insertHostMappingSchema = createInsertSchema(hostMappings).omit({ id: true });
export const insertSystemConfigSchema = createInsertSchema(systemConfig).omit({ id: true });
export const insertLogEntrySchema = createInsertSchema(logEntries).omit({ id: true });

// Types
export type HostRule = typeof hostRules.$inferSelect;
export type HostMapping = typeof hostMappings.$inferSelect;
export type SystemConfig = typeof systemConfig.$inferSelect;
export type LogEntry = typeof logEntries.$inferSelect;

export type InsertHostRule = z.infer<typeof insertHostRuleSchema>;
export type InsertHostMapping = z.infer<typeof insertHostMappingSchema>;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
export type InsertLogEntry = z.infer<typeof insertLogEntrySchema>;
