import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

interface CreatePackageRequest {
  name: string;
  description: string;
  price: number;
  productIds: string[];
}

interface UpdatePackageRequest {
  name?: string;
  description?: string;
  price?: number;
  productIds?: string[];
}

// Get all packages
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const packages = await prisma.package.findMany({
      include: {
        products: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(packages);
  } catch (error) {
    next(error);
  }
});

// Get package by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const package_ = await prisma.package.findUnique({
      where: { id: req.params.id },
      include: {
        products: true
      }
    });

    if (!package_) {
      throw new AppError(404, 'Package not found');
    }

    res.json(package_);
  } catch (error) {
    next(error);
  }
});

// Create package (Admin only)
router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('productIds').isArray().notEmpty()
  ],
  async (req: Request<{}, {}, CreatePackageRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid input data');
      }

      const { name, description, price, productIds } = req.body;

      // Verify all products exist
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });

      if (products.length !== productIds.length) {
        throw new AppError(400, 'One or more products not found');
      }

      const package_ = await prisma.package.create({
        data: {
          name,
          description,
          price,
          products: {
            connect: productIds.map(id => ({ id }))
          }
        },
        include: {
          products: true
        }
      });

      res.status(201).json(package_);
    } catch (error) {
      next(error);
    }
  }
);

// Update package (Admin only)
router.put(
  '/:id',
  requireAdmin,
  [
    body('name').optional().notEmpty().trim(),
    body('description').optional().notEmpty().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('productIds').optional().isArray()
  ],
  async (req: Request<{ id: string }, {}, UpdatePackageRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid input data');
      }

      const { name, description, price, productIds } = req.body;

      // If updating products, verify they exist
      if (productIds) {
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productIds
            }
          }
        });

        if (products.length !== productIds.length) {
          throw new AppError(400, 'One or more products not found');
        }
      }

      const package_ = await prisma.package.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price }),
          ...(productIds && {
            products: {
              set: productIds.map(id => ({ id }))
            }
          })
        },
        include: {
          products: true
        }
      });

      res.json(package_);
    } catch (error) {
      if ((error as any).code === 'P2025') {
        throw new AppError(404, 'Package not found');
      }
      next(error);
    }
  }
);

// Delete package (Admin only)
router.delete('/:id', requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.package.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new AppError(404, 'Package not found');
    }
    next(error);
  }
});

export { router as packagesRouter }; 