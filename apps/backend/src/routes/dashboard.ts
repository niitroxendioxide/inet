import { Router } from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard statistics (Admin only)
router.get('/stats', authenticateJWT, requireAdmin, async (_req, res) => {
  try {
    // Get product statistics
    const products = await prisma.product.groupBy({
      by: ['type'],
      _count: true
    });

    const productStats = {
      total: await prisma.product.count(),
      byType: Object.fromEntries(
        products.map(p => [p.type.toLowerCase(), p._count])
      )
    };

    res.json({
      products: productStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

export { router as dashboardRouter }; 