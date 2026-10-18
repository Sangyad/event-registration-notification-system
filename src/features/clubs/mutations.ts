import { prisma } from "@/lib/infra/prisma";

export interface ClubWriteData {
  name: string;
  shortName: string | null;
}

export async function createClub(data: ClubWriteData): Promise<void> {
  await prisma.club.create({ data });
}

export async function updateClub(clubId: string, data: ClubWriteData): Promise<void> {
  await prisma.club.update({ where: { id: clubId }, data });
}

export async function deleteClub(clubId: string): Promise<void> {
  await prisma.club.delete({ where: { id: clubId } });
}
