import { Router } from "express";
import { PrismaClient } from "@prisma/client/extension";

const router = Router();
const prisma = new PrismaClient();

router.get('/', async(req, res) => {

    const healthStatus = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      server: 'OK',
      database: 'PENDING'
    }
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = 'OK';
    
    res.status(200).json(healthStatus);
  } catch (error) {
    healthStatus.status = 'DOWN';
    healthStatus.services.database = 'FAIL';
    
    res.status(503).json(healthStatus); // 503 = Service Unavailable
  }

});

export default router;