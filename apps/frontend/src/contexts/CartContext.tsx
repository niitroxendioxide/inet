import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCart,
  addCartItem as apiAddCartItem,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCartApi
} from "@/lib/api";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'EXPERIENCE' | 'PACKAGE';
  image?: string;
  description: string;
  quantity: number;
  details?: any; // For storing additional details like dates, passengers, etc.
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
  userEmail: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Persist login state and user email across reloads
  useEffect(() => {
    const token = localStorage.getItem('travelToken');
    const savedAuth = localStorage.getItem('travelAuth');
    if (token && savedAuth) {
      setIsLoggedIn(true);
      try {
        const authData = JSON.parse(savedAuth);
        setUserEmail(authData.email);
      } catch {
        setUserEmail(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
  }, []);

  // Fetch cart from API when logged in
  useEffect(() => {
    if (isLoggedIn) {
      getCart()
        .then(cart => {
          setItems(
            (cart.items || []).map((item: any) => ({
              id: item.id,
              name: item.product?.name || item.package?.name || '',
              price: item.product?.price || item.package?.price || 0,
              type: item.product?.type || 'PACKAGE',
              image: item.product?.image || item.package?.image,
              description: item.product?.description || item.package?.description || '',
              quantity: item.quantity,
              details: item.product || item.package
            }))
          );
        })
        .catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, [isLoggedIn]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    if (!isLoggedIn) {
      alert('Por favor inicia sesión para agregar elementos a tu carrito');
      return;
    }
    try {
      // Determine if it's a product or package
      const isPackage = item.type === 'PACKAGE';
      const res = await apiAddCartItem({
        productId: isPackage ? undefined : item.id,
        packageId: isPackage ? item.id : undefined,
        quantity: 1
      });
      // Refetch cart
      const cart = await getCart();
      setItems(
        (cart.items || []).map((item: any) => ({
          id: item.id,
          name: item.product?.name || item.package?.name || '',
          price: item.product?.price || item.package?.price || 0,
          type: item.product?.type || 'PACKAGE',
          image: item.product?.image || item.package?.image,
          description: item.product?.description || item.package?.description || '',
          quantity: item.quantity,
          details: item.product || item.package
        }))
      );
    } catch (e) {
      alert('Error al agregar al carrito');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await apiRemoveCartItem(id);
      // Refetch cart to ensure sync
      const cart = await getCart();
      setItems(
        (cart.items || []).map((item: any) => ({
          id: item.id,
          name: item.product?.name || item.package?.name || '',
          price: item.product?.price || item.package?.price || 0,
          type: item.product?.type || 'PACKAGE',
          image: item.product?.image || item.package?.image,
          description: item.product?.description || item.package?.description || '',
          quantity: item.quantity,
          details: item.product || item.package
        }))
      );
    } catch (e) {
      alert('Error al quitar del carrito');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    try {
      await apiUpdateCartItem(id, quantity);
      setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    } catch (e) {
      alert('Error al actualizar cantidad');
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi(items);
      setItems([]);
    } catch (e) {
      alert('Error al vaciar el carrito');
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('travelAuth', JSON.stringify({ email }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    localStorage.removeItem('travelAuth');
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isLoggedIn,
      login,
      logout,
      userEmail
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
