CREATE TYPE "public"."appointment_format" AS ENUM('offline', 'online');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('Upcoming', 'Reschedule Pending', 'Completed', 'Cancelled', 'Rescheduled');--> statement-breakpoint
CREATE TYPE "public"."cancelled_by" AS ENUM('patient', 'doctor');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer NOT NULL,
	"format" "appointment_format" NOT NULL,
	"reason" text,
	"status" "appointment_status" NOT NULL,
	"cancelled_by" "cancelled_by",
	"proposed_start_at" timestamp with time zone,
	"replaces_appointment_id" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctor_profiles_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patient_profiles_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_replaces_appointment_id_appointments_id_fk" FOREIGN KEY ("replaces_appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_doctor_start_occupied_uidx" ON "appointments" USING btree ("doctor_id","start_at") WHERE "appointments"."status" IN ('Upcoming', 'Reschedule Pending');
