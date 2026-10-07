ALTER TABLE "doctor_schedules" ADD COLUMN IF NOT EXISTS "zone_b_overrides" jsonb DEFAULT '[]'::jsonb NOT NULL;
