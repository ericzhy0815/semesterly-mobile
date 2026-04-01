ALTER TABLE `semesters` ADD `activeScheduleId` integer REFERENCES `schedules`(`id`) ON UPDATE no action ON DELETE set null;
