CREATE TABLE `roomType` (
	`id` varchar(36) NOT NULL,
	`description` varchar(100) NOT NULL,
	`created_At` timestamp NOT NULL DEFAULT (now()),
	`updated_At` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roomType_id` PRIMARY KEY(`id`),
	CONSTRAINT `roomType_description_unique` UNIQUE(`description`)
);
--> statement-breakpoint
ALTER TABLE `bedRooms` ADD `room_type_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `bedRooms` ADD CONSTRAINT `bedRooms_room_type_id_roomType_id_fk` FOREIGN KEY (`room_type_id`) REFERENCES `roomType`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bedRooms` DROP COLUMN `bedroom_type`;