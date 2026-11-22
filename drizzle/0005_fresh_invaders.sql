ALTER TABLE `reservation` RENAME COLUMN `amount` TO `nb_personnes`;--> statement-breakpoint
ALTER TABLE `reservation` MODIFY COLUMN `nb_personnes` int NOT NULL;