import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Listar todos los vuelos con datos completos
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const flights = await prisma.product.findMany({
      where: { type: ProductType.FLIGHT },
      include: { flight: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(flights);
  } catch (error) {
    next(error);
  }
});

// Obtener vuelo por ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const flight = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { flight: true }
    });
    if (!flight || !flight.flight) {
      throw new AppError(404, 'Vuelo no encontrado');
    }
    res.json(flight);
  } catch (error) {
    next(error);
  }
});

// Crear vuelo (Admin) - Requiere autenticación
router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('from').notEmpty(),
    body('to').notEmpty(),
    body('departure').notEmpty(),
    body('arrival').notEmpty(),
    body('duration').notEmpty(),
    body('class').optional().isString(),
    body('stops').optional().isString(),
    body('airline').optional().isString(),
    body('flightNumber').optional().isString()
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Datos inválidos');
      }
      const { name, description, price, from, to, departure, arrival, duration, class: flightClass, stops, airline, flightNumber } = req.body;
      // Crear producto base
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          type: ProductType.FLIGHT,
          flight: {
            create: {
              from,
              to,
              departure,
              arrival,
              duration,
              class: flightClass || 'Económica',
              stops: stops || 'Directo',
              airline,
              flightNumber
            }
          }
        },
        include: { flight: true }
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as flightsRouter }; 