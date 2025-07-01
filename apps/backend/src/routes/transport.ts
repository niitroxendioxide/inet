import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Listar todos los transportes con datos completos
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const transport = await prisma.product.findMany({
      where: { type: ProductType.TRANSPORT },
      include: { transport: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(transport);
  } catch (error) {
    next(error);
  }
});

// Obtener transporte por ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const transport = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { transport: true }
    });
    if (!transport || !transport.transport) {
      throw new AppError(404, 'Transporte no encontrado');
    }
    res.json(transport);
  } catch (error) {
    next(error);
  }
});

// Crear transporte (Admin) - Requiere autenticación
router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('vehicleType').notEmpty(),
    body('capacity').optional().isInt({ min: 1 }),
    body('pickupLocation').optional().isString(),
    body('dropoffLocation').optional().isString(),
    body('duration').optional().isString(),
    body('includes').optional().isArray()
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Datos inválidos');
      }
      const { name, description, price, vehicleType, capacity, pickupLocation, dropoffLocation, duration, includes } = req.body;
      // Crear producto base
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          type: ProductType.TRANSPORT,
          transport: {
            create: {
              vehicleType,
              capacity,
              pickupLocation,
              dropoffLocation,
              duration,
              includes: includes || []
            }
          }
        },
        include: { transport: true }
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as transportRouter }; 