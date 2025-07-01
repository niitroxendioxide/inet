import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

interface AddCartItemRequest {
  productId?: string;
  packageId?: string;
  quantity: number;
}

interface UpdateCartItemRequest {
  quantity: number;
}

// Get user's cart
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: true,
            package: true
          }
        }
      }
    });

    if (!cart) {
      // Create a new cart if one doesn't exist
      const newCart = await prisma.cart.create({
        data: {
          userId: req.user!.userId,
        },
        include: {
          items: {
            include: {
              product: true,
              package: true
            }
          }
        }
      });
      res.json(newCart);
      return;
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post(
  '/items',
  [
    body('productId').optional().isString(),
    body('packageId').optional().isString(),
    body('quantity').isInt({ min: 1 }).toInt()
  ],
  async (req: Request<{}, {}, AddCartItemRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid input data');
      }

      const { productId, packageId, quantity } = req.body;

      if (!productId && !packageId) {
        throw new AppError(400, 'Either productId or packageId must be provided');
      }

      if (productId && packageId) {
        throw new AppError(400, 'Cannot add both product and package simultaneously');
      }

      // Get or create cart
      let cart = await prisma.cart.findFirst({
        where: { userId: req.user!.userId }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: req.user!.userId
          }
        });
      }

      // Verify product/package exists
      if (productId) {
        const product = await prisma.product.findUnique({
          where: { id: productId }
        });
        if (!product) {
          throw new AppError(404, 'Product not found');
        }
      }

      if (packageId) {
        const package_ = await prisma.package.findUnique({
          where: { id: packageId }
        });
        if (!package_) {
          throw new AppError(404, 'Package not found');
        }
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId || undefined,
          packageId: packageId || undefined
        }
      });

      let cartItem;
      if (existingItem) {
        // If exists, update quantity
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: { product: true, package: true }
        });
      } else {
        // Add item to cart
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            packageId,
            quantity
          },
          include: {
            product: true,
            package: true
          }
        });
      }

      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  }
);

// Update cart item
router.put(
  '/items/:id',
  [
    body('quantity').isInt({ min: 1 }).toInt()
  ],
  async (req: Request<{ id: string }, {}, UpdateCartItemRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(400, 'Invalid input data');
      }

      const { quantity } = req.body;

      // Verify item belongs to user's cart
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: req.params.id,
          cart: {
            userId: req.user!.userId
          }
        }
      });

      if (!cartItem) {
        throw new AppError(404, 'Cart item not found');
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: req.params.id },
        data: { quantity },
        include: {
          product: true,
          package: true
        }
      });

      res.json(updatedItem);
    } catch (error) {
      next(error);
    }
  }
);

// Remove item from cart
router.delete('/items/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verify item belongs to user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: req.params.id,
        cart: {
          userId: req.user!.userId
        }
      }
    });

    if (!cartItem) {
      throw new AppError(404, 'Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export { router as cartRouter }; 