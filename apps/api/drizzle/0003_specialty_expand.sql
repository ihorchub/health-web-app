-- Expand specialty enum for SCR-02 (14 specialties).
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'neurologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'ophthalmologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'orthopedist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'endocrinologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'gastroenterologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'gynecologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'urologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'otolaryngologist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'psychiatrist';
ALTER TYPE "public"."specialty" ADD VALUE IF NOT EXISTS 'pulmonologist';
