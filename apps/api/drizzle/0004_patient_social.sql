CREATE TYPE "public"."education_kind" AS ENUM('university', 'certificate', 'training');--> statement-breakpoint
ALTER TABLE "doctor_schedules" ADD COLUMN "vacation_dates" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"rating" integer NOT NULL,
	"text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_favourites" (
	"patient_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "patient_favourites_patient_id_doctor_id_pk" PRIMARY KEY("patient_id","doctor_id")
);
--> statement-breakpoint
CREATE TABLE "patient_recently_viewed" (
	"patient_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "patient_recently_viewed_patient_id_doctor_id_pk" PRIMARY KEY("patient_id","doctor_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "doctor_education" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_user_id" text NOT NULL,
	"kind" "education_kind" NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"year_from" integer NOT NULL,
	"year_to" integer
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patient_id_patient_profiles_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_doctor_id_doctor_profiles_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_favourites" ADD CONSTRAINT "patient_favourites_patient_id_patient_profiles_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_favourites" ADD CONSTRAINT "patient_favourites_doctor_id_doctor_profiles_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_recently_viewed" ADD CONSTRAINT "patient_recently_viewed_patient_id_patient_profiles_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_recently_viewed" ADD CONSTRAINT "patient_recently_viewed_doctor_id_doctor_profiles_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_education" ADD CONSTRAINT "doctor_education_doctor_user_id_doctor_profiles_user_id_fk" FOREIGN KEY ("doctor_user_id") REFERENCES "public"."doctor_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_appointment_id_uidx" ON "reviews" USING btree ("appointment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_doctor_proposed_occupied_uidx" ON "appointments" USING btree ("doctor_id","proposed_start_at") WHERE "appointments"."status" = 'Reschedule Pending' AND "appointments"."proposed_start_at" IS NOT NULL;
