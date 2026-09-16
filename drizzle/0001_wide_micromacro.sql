CREATE TABLE `profile_views` (
	`id` text PRIMARY KEY NOT NULL,
	`worker_id` text NOT NULL,
	`client_id` text NOT NULL,
	`viewed_at` text NOT NULL,
	FOREIGN KEY (`worker_id`) REFERENCES `workers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_profile_views_worker_date` ON `profile_views` (`worker_id`,`viewed_at`);--> statement-breakpoint
CREATE INDEX `idx_profile_views_client` ON `profile_views` (`client_id`);--> statement-breakpoint
ALTER TABLE `clients` ADD `user_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `clients_user_id_unique` ON `clients` (`user_id`);--> statement-breakpoint
ALTER TABLE `workers` ADD `user_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `workers_user_id_unique` ON `workers` (`user_id`);