-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamMembers" TEXT[] DEFAULT ARRAY['']::TEXT[];
