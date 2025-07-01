import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Listar todos los hoteles con datos completos
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await prisma.product.findMany({
      where: { type: ProductType.HOTEL },
      include: { hotel: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

// Obtener hotel por ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const hotel = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { hotel: true }
    });
    if (!hotel || !hotel.hotel) {
      throw new AppError(404, 'Hotel no encontrado');
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
});

// Crear hotel (Admin) - Requiere autenticación
router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('location').notEmpty(),
    body('amenities').isArray(),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('reviews').optional().isInt({ min: 0 }),
    body('checkIn').optional().isString(),
    body('checkOut').optional().isString(),
    body('rooms').optional().isInt({ min: 1 }),
    body('stars').optional().isInt({ min: 1, max: 5 })
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Datos inválidos');
      }
      const { name, description, price, location, amenities, rating, reviews, checkIn, checkOut, rooms, stars } = req.body;
      // Crear producto base
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          type: ProductType.HOTEL,
          hotel: {
            create: {
              location,
              amenities,
              rating,
              reviews: reviews || 0,
              checkIn,
              checkOut,
              rooms,
              stars
            }
          }
        },
        include: { hotel: true }
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as hotelsRouter }; 