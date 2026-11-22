CREATE TABLE `reservation` (
	`id` varchar(36) NOT NULL,
	`beginingAt` timestamp NOT NULL,
	`endAt` timestamp NOT NULL,
	`userId` varchar(36) NOT NULL,
	`bedroomId` varchar(36) NOT NULL,
	`transactionId` varchar(100),
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`amount` decimal(10,2) NOT NULL,
	`created_At` timestamp NOT NULL DEFAULT (now()),
	`updated_At` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservation_id` PRIMARY KEY(`id`),
	CONSTRAINT `reservation_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_bedroomId_bedRooms_id_fk` FOREIGN KEY (`bedroomId`) REFERENCES `bedRooms`(`id`) ON DELETE no action ON UPDATE no action;