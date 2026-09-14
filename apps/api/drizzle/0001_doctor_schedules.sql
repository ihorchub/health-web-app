CREATE TABLE IF NOT EXISTS "doctor_schedules" (
	"doctor_user_id" text PRIMARY KEY NOT NULL,
	"base_price_uah" integer DEFAULT 600 NOT NULL,
	"promo_price_uah" integer,
	"promo_valid_until" date,
	"supported_formats" text[] NOT NULL,
	"weekly_template" jsonb NOT NULL,
	"visible_in_search" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_user_id_doctor_profiles_user_id_fk" FOREIGN KEY ("doctor_user_id") REFERENCES "public"."doctor_profiles"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
