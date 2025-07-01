import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, ProductType } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Listar todas las experiencias con datos completos
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const experiences = await prisma.product.findMany({
      where: { type: ProductType.EXCURSION },
      include: { excursion: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
});

// Obtener experiencia por ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const experience = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { excursion: true }
    });
    if (!experience || !experience.excursion) {
      throw new AppError(404, 'Experiencia no encontrada');
    }
    res.json(experience);
  } catch (error) {
    next(error);
  }
});

// Crear experiencia (Admin) - Requiere autenticación
router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('location').notEmpty(),
    body('category').optional().isString(),
    body('duration').optional().isString(),
    body('maxGroupSize').optional().isInt({ min: 1 }),
    body('difficulty').optional().isString(),
    body('includes').optional().isArray(),
    body('requirements').optional().isArray()
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Datos inválidos');
      }
      const { name, description, price, location, category, duration, maxGroupSize, difficulty, includes, requirements } = req.body;
      // Crear producto base
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          type: ProductType.EXCURSION,
          excursion: {
            create: {
              location,
              category: category || 'Excursión',
              duration,
              maxGroupSize,
              difficulty,
              includes: includes || [],
              requirements: requirements || []
            }
          }
        },
        include: { excursion: true }
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { router as experiencesRouter }; 