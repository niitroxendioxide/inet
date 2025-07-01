import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticateJWT, requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  type: ProductType;
}

interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  type?: ProductType;
}

// Get all products with optional type filter
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { product_type } = req.query;
    
    const where = product_type ? {
      type: product_type.toString().toUpperCase() as ProductType
    } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      data: products,
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create product (Admin only)
router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('type').isIn(Object.values(ProductType))
  ],
  async (req: Request<{}, {}, CreateProductRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid input data');
      }

      const { name, description, price, type } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          type
        }
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Update product (Admin only)
router.put(
  '/:id',
  authenticateJWT,
  requireAdmin,
  [
    body('name').optional().notEmpty().trim(),
    body('description').optional().notEmpty().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('type').optional().isIn(Object.values(ProductType))
  ],
  async (req: Request<{ id: string }, {}, UpdateProductRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid input data');
      }

      const { name, description, price, type } = req.body;

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price }),
          ...(type && { type })
        }
      });

      res.json(product);
    } catch (error) {
      if ((error as any).code === 'P2025') {
        throw new AppError(404, 'Product not found');
      }
      next(error);
    }
  }
);

// Delete product (Admin only)
router.delete('/:id', authenticateJWT, requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new AppError(404, 'Product not found');
    }
    next(error);
  }
});

export { router as productsRouter }; 