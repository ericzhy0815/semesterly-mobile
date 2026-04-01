CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`courseId` integer NOT NULL,
	`startDateTime` text NOT NULL,
	`endDateTime` text NOT NULL,
	FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scheduleId` integer NOT NULL,
	`title` text NOT NULL,
	`code` text NOT NULL,
	`section` integer,
	`colorIndex` integer NOT NULL,
	`instructor` text,
	`location` text,
	FOREIGN KEY (`scheduleId`) REFERENCES `schedules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_courses`("id", "scheduleId", "title", "code", "section", "colorIndex", "instructor", "location") SELECT "id", "scheduleId", "title", "code", "section", "colorIndex", "instructor", "location" FROM `courses`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
ALTER TABLE `__new_courses` RENAME TO `courses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `semesters` ADD `startDate` text NOT NULL;--> statement-breakpoint
ALTER TABLE `semesters` ADD `endDate` text NOT NULL;