/*
  Warnings:

  - The `role` column on the `account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `asset` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `location` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `action_type` on the `asset_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `maintenance_record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive', 'resigned');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('user', 'admin', 'manager');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('active', 'inactive', 'disposed', 'under_maintenance');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('repair', 'maintenance', 'inspection');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('created', 'assigned', 'transferred', 'repaired', 'disposed');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('lobby', 'meeting_room', 'office', 'storage', 'lab', 'tech_room', 'parking', 'workshop');

-- AlterTable
ALTER TABLE "account" DROP COLUMN "role",
ADD COLUMN     "role" "AccountRole" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "asset" DROP COLUMN "status",
ADD COLUMN     "status" "AssetStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "asset_history" DROP COLUMN "action_type",
ADD COLUMN     "action_type" "ActionType" NOT NULL;

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "gender" "Gender",
DROP COLUMN "status",
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "location" DROP COLUMN "type",
ADD COLUMN     "type" "LocationType";

-- AlterTable
ALTER TABLE "maintenance_record" DROP COLUMN "type",
ADD COLUMN     "type" "MaintenanceType" NOT NULL;
