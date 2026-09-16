CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_created_at` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`full_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`area` text NOT NULL,
	`service` text NOT NULL,
	`start_date` text NOT NULL,
	`schedule` text NOT NULL,
	`budget` real NOT NULL,
	`household_size` integer NOT NULL,
	`requirements` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_reference_unique` ON `clients` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_clients_status` ON `clients` (`status`);--> statement-breakpoint
CREATE INDEX `idx_clients_area_service` ON `clients` (`area`,`service`);--> statement-breakpoint
CREATE TABLE `matches` (
	`id` text PRIMARY KEY NOT NULL,
	`worker_id` text NOT NULL,
	`client_id` text NOT NULL,
	`status` text DEFAULT 'shortlisted' NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`worker_id`) REFERENCES `workers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_matches_client_status` ON `matches` (`client_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_matches_worker_status` ON `matches` (`worker_id`,`status`);--> statement-breakpoint
CREATE TABLE `workers` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`full_name` text NOT NULL,
	`phone` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`nrc_number` text NOT NULL,
	`area` text NOT NULL,
	`experience_years` integer NOT NULL,
	`work_type` text NOT NULL,
	`expected_rate` real NOT NULL,
	`services` text NOT NULL,
	`languages` text NOT NULL,
	`work_history` text NOT NULL,
	`reference_1_name` text NOT NULL,
	`reference_1_phone` text NOT NULL,
	`reference_2_name` text NOT NULL,
	`reference_2_phone` text NOT NULL,
	`emergency_name` text NOT NULL,
	`emergency_phone` text NOT NULL,
	`photo_key` text,
	`nrc_document_key` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workers_reference_unique` ON `workers` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_workers_status` ON `workers` (`status`);--> statement-breakpoint
CREATE INDEX `idx_workers_area_work_type` ON `workers` (`area`,`work_type`);