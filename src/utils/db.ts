import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { createPrismaAdapter } from '../../prisma/config'

dotenv.config()

export const prismaClient = new PrismaClient({
  adapter: createPrismaAdapter(),
})
