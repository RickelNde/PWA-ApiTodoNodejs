CREATE TABLE `bedRooms` (
	`id` varchar(36) NOT NULL,
	`bedrooms_number` int NOT NULL,
	`bedroom_type` varchar(50) NOT NULL,
	`description` varchar(200) NOT NULL,
	`nb_max_clients` int NOT NULL,
	`size_in_meter_square` decimal(6,2) NOT NULL,
	`nb_beds` int NOT NULL,
	`bed1_id` varchar(36) NOT NULL,
	`bed2_id` varchar(36),
	`price` decimal(10,2) NOT NULL,
	`nom_hotel` varchar(100) NOT NULL,
	`created_At` timestamp NOT NULL DEFAULT (now()),
	`updated_At` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bedRooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `bedRooms_bedrooms_number_unique` UNIQUE(`bedrooms_number`)
);
--> statement-breakpoint
CREATE TABLE `bedType` (
	`id` varchar(36) NOT NULL,
	`description` varchar(100) NOT NULL,
	`created_At` timestamp NOT NULL DEFAULT (now()),
	`updated_At` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bedType_id` PRIMARY KEY(`id`),
	CONSTRAINT `bedType_description_unique` UNIQUE(`description`)
);
--> statement-breakpoint
CREATE TABLE `userRole` (
	`id` varchar(36) NOT NULL,
	`description` varchar(100) NOT NULL,
	`created_At` timestamp NOT NULL DEFAULT (now()),
	`updated_At` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userRole_id` PRIMARY KEY(`id`),
	CONSTRAINT `userRole_description_unique` UNIQUE(`description`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_username_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `firstName` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `passeWord` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `role_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_At` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_At` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `bedRooms` ADD CONSTRAINT `bedRooms_bed1_id_bedType_id_fk` FOREIGN KEY (`bed1_id`) REFERENCES `bedType`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bedRooms` ADD CONSTRAINT `bedRooms_bed2_id_bedType_id_fk` FOREIGN KEY (`bed2_id`) REFERENCES `bedType`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_userRole_id_fk` FOREIGN KEY (`role_id`) REFERENCES `userRole`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `password`;