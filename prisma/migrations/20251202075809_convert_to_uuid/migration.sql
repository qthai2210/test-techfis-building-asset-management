/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `asset_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `maintenance_record` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "asset" DROP CONSTRAINT "asset_assigned_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "asset" DROP CONSTRAINT "asset_category_id_fkey";

-- DropForeignKey
ALTER TABLE "asset" DROP CONSTRAINT "asset_location_id_fkey";

-- DropForeignKey
ALTER TABLE "asset" DROP CONSTRAINT "asset_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "asset_history" DROP CONSTRAINT "asset_history_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "asset_history" DROP CONSTRAINT "asset_history_from_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "asset_history" DROP CONSTRAINT "asset_history_to_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_department_id_fkey";

-- DropForeignKey
ALTER TABLE "maintenance_record" DROP CONSTRAINT "maintenance_record_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "maintenance_record" DROP CONSTRAINT "maintenance_record_supplier_id_fkey";

-- AlterTable
ALTER TABLE "account" DROP CONSTRAINT "account_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "employee_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "account_id_seq";

-- AlterTable
ALTER TABLE "asset" DROP CONSTRAINT "asset_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_id" SET DATA TYPE TEXT,
ALTER COLUMN "location_id" SET DATA TYPE TEXT,
ALTER COLUMN "assigned_employee_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "asset_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "asset_id_seq";

-- AlterTable
ALTER TABLE "asset_history" DROP CONSTRAINT "asset_history_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "asset_id" SET DATA TYPE TEXT,
ALTER COLUMN "from_employee_id" SET DATA TYPE TEXT,
ALTER COLUMN "to_employee_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "asset_history_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "asset_history_id_seq";

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "category_id_seq";

-- AlterTable
ALTER TABLE "department" DROP CONSTRAINT "department_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "department_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "department_id_seq";

-- AlterTable
ALTER TABLE "employee" DROP CONSTRAINT "employee_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "department_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "employee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "employee_id_seq";

-- AlterTable
ALTER TABLE "location" DROP CONSTRAINT "location_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "location_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "location_id_seq";

-- AlterTable
ALTER TABLE "maintenance_record" DROP CONSTRAINT "maintenance_record_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "asset_id" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "maintenance_record_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "maintenance_record_id_seq";

-- AlterTable
ALTER TABLE "supplier" DROP CONSTRAINT "supplier_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "supplier_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "supplier_id_seq";

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_assigned_employee_id_fkey" FOREIGN KEY ("assigned_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_record" ADD CONSTRAINT "maintenance_record_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_record" ADD CONSTRAINT "maintenance_record_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_from_employee_id_fkey" FOREIGN KEY ("from_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_to_employee_id_fkey" FOREIGN KEY ("to_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
