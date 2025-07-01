# 🧳 TravelHub Frontend - Documentación

## 📋 Índice
- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración e Instalación](#configuración-e-instalación)
- [Componentes Principales](#componentes-principales)
- [Páginas](#páginas)
- [API y Servicios](#api-y-servicios)
- [Contextos y Estado Global](#contextos-y-estado-global)
- [Autenticación](#autenticación)
- [Carrito de Compras](#carrito-de-compras)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Scripts Disponibles](#scripts-disponibles)

---

## 🎯 Descripción General

TravelHub es una plataforma de venta de viajes que permite a los usuarios explorar y comprar productos turísticos como vuelos, hoteles, transportes y experiencias. El frontend está construido con React + TypeScript y se conecta a un backend Express con Prisma y PostgreSQL.

### 🚀 Características Principales
- **Navegación fluida** entre diferentes tipos de productos
- **Autenticación completa** con JWT
- **Carrito de compras persistente** sincronizado con el backend
- **Interfaz moderna** con Tailwind CSS y shadcn/ui
- **Datos enriquecidos** para cada tipo de producto
- **Responsive design** para todos los dispositivos

---

## 🛠 Tecnologías Utilizadas

### Core
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### UI/UX
- **Tailwind CSS** - Framework de CSS utility-first
- **shadcn/ui** - Componentes de UI reutilizables
- **Lucide React** - Íconos modernos

### Estado y Datos
- **React Context** - Estado global
- **Fetch API** - Comunicación con backend

### Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS

---

## 📁 Estructura del Proyecto

```
wanderlust-marketplace-hub/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes de shadcn/ui
│   │   ├── AuthComponent.tsx
│   │   └── ShoppingCart.tsx
│   ├── contexts/           # Contextos de React
│   │   └── CartContext.tsx
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades y servicios
│   │   ├── api.ts         # Funciones de API
│   │   └── utils.ts       # Utilidades generales
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Flights.tsx
│   │   ├── Hotels.tsx
│   │   ├── Transport.tsx
│   │   ├── Experiences.tsx
│   │   └── Index.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/                 # Archivos estáticos
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Configuración e Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend ejecutándose en `http://localhost:3000`

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd wanderlust-marketplace-hub

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno
El frontend se conecta automáticamente al backend en `http://localhost:3000`. Si necesitas cambiar la URL, modifica las funciones en `src/lib/api.ts`.

---

## 🧩 Componentes Principales

### AuthComponent
**Ubicación**: `src/components/AuthComponent.tsx`

Componente de autenticación que maneja login y registro.

#### Características:
- **Tabs** para alternar entre login y registro
- **Validación de formularios** con mensajes de error
- **Botones de mostrar/ocultar contraseña**
- **Estados de carga** con animaciones
- **Persistencia de sesión** con localStorage

#### Props:
```typescript
// No recibe props, usa CartContext internamente
```

#### Uso:
```tsx
import AuthComponent from "@/components/AuthComponent";

<AuthComponent />
```

### ShoppingCart
**Ubicación**: `src/components/ShoppingCart.tsx`

Componente del carrito de compras flotante.

#### Características:
- **Vista previa** de items en el carrito
- **Contador** de items
- **Modal expandible** con lista completa
- **Funciones de edición** (cantidad, eliminar)

---

## 📄 Páginas

### Index (Homepage)
**Ubicación**: `src/pages/Index.tsx`

Página principal con navegación a todas las secciones.

#### Secciones:
- **Header** con navegación y autenticación
- **Hero section** con mensaje de bienvenida
- **Cards de navegación** a vuelos, hoteles, transportes y experiencias
- **Footer** con información de la plataforma

### Flights
**Ubicación**: `src/pages/Flights.tsx`

Página de vuelos con datos enriquecidos.

#### Características:
- **Lista de vuelos** con información detallada
- **Datos específicos**: origen, destino, horarios, aerolínea
- **Visualización de ruta** con íconos y líneas
- **Botón de agregar al carrito**

#### Datos mostrados:
```typescript
interface Flight {
  id: string;
  name: string;
  description: string;
  price: number;
  flight: {
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
    class: string;
    stops: string;
    airline?: string;
    flightNumber?: string;
  };
}
```

### Hotels
**Ubicación**: `src/pages/Hotels.tsx`

Página de hoteles con información completa.

#### Características:
- **Grid responsive** de hoteles
- **Rating y reviews** con estrellas
- **Amenities** como badges
- **Información de ubicación** y servicios

#### Datos mostrados:
```typescript
interface Hotel {
  id: string;
  name: string;
  description: string;
  price: number;
  hotel: {
    location: string;
    rating?: number;
    reviews: number;
    amenities: string[];
    checkIn?: string;
    checkOut?: string;
    rooms?: number;
    stars?: number;
  };
}
```

### Transport
**Ubicación**: `src/pages/Transport.tsx`

Página de servicios de transporte.

#### Características:
- **Tipos de vehículos** (sedán, bus, auto)
- **Información de capacidad** y duración
- **Servicios incluidos** como badges
- **Ubicaciones de pickup/dropoff**

### Experiences
**Ubicación**: `src/pages/Experiences.tsx`

Página de experiencias y excursiones.

#### Características:
- **Categorías** de experiencias
- **Información de dificultad** y duración
- **Servicios incluidos** y requisitos
- **Tamaño máximo de grupo**

---

## 🔌 API y Servicios

### Configuración
**Archivo**: `src/lib/api.ts`

Todas las funciones de API están centralizadas en este archivo.

### Funciones Principales

#### Autenticación
```typescript
// Login de usuario
loginUser(email: string, password: string): Promise<AuthResponse>

// Registro de usuario
registerUser(email: string, password: string, name: string): Promise<AuthResponse>
```

#### Productos
```typescript
// Obtener vuelos
getFlights(): Promise<Flight[]>

// Obtener hoteles
getHotels(): Promise<Hotel[]>

// Obtener transportes
getTransport(): Promise<Transport[]>

// Obtener experiencias
getExperiences(): Promise<Experience[]>

// Obtener paquetes
getPackages(): Promise<Package[]>
```

#### Carrito
```typescript
// Obtener carrito del usuario
getCart(): Promise<Cart>

// Agregar item al carrito
addCartItem({ productId?, packageId?, quantity }): Promise<CartItem>

// Actualizar cantidad
updateCartItem(id: string, quantity: number): Promise<CartItem>

// Eliminar item
removeCartItem(id: string): Promise<void>

// Limpiar carrito
clearCartApi(cartItems: { id: string }[]): Promise<void>
```

### Headers de Autenticación
```typescript
function getAuthHeaders() {
  const token = localStorage.getItem('travelToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

---

## 🌐 Contextos y Estado Global

### CartContext
**Ubicación**: `src/contexts/CartContext.tsx`

Maneja el estado global del carrito y la autenticación.

#### Estado:
```typescript
interface CartContextType {
  // Autenticación
  isLoggedIn: boolean;
  userEmail: string | null;
  
  // Carrito
  cart: Cart | null;
  cartItems: CartItem[];
  
  // Funciones
  login: (email: string) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantity: number) => void;
  clearCart: () => void;
}
```

#### Uso:
```tsx
import { useCart } from "@/contexts/CartContext";

const { isLoggedIn, addToCart, cartItems } = useCart();
```

---

## 🔐 Autenticación

### Flujo de Autenticación
1. **Registro**: Usuario crea cuenta con email, contraseña y nombre
2. **Login**: Usuario ingresa credenciales
3. **Token JWT**: Se almacena en localStorage como `travelToken`
4. **Persistencia**: El token se mantiene entre sesiones
5. **Headers**: Se incluye automáticamente en peticiones autenticadas

### Credenciales de Prueba
```
Admin: admin@travelhub.com / admin123
Client: client@travelhub.com / client123
```

### Componente AuthComponent
- **Tabs** para alternar entre login y registro
- **Validación** de formularios en tiempo real
- **Mensajes de error** específicos por campo
- **Estados de carga** con animaciones
- **Botones de mostrar/ocultar** contraseña

---

## 🛒 Carrito de Compras

### Funcionalidades
- **Agregar productos** individuales o paquetes
- **Editar cantidades** en tiempo real
- **Eliminar items** del carrito
- **Persistencia** sincronizada con el backend
- **Vista previa** con contador de items

### Integración con Backend
- **Sincronización automática** al agregar/eliminar items
- **Refetch** del carrito después de operaciones
- **Manejo de errores** con mensajes informativos

### Componente ShoppingCart
- **Badge** con contador de items
- **Modal expandible** con lista completa
- **Botones de acción** para cada item
- **Total del carrito** calculado automáticamente

---

## 🛠 Guías de Desarrollo

### Agregar un Nuevo Tipo de Producto

1. **Backend**: Crear modelo en Prisma y endpoints
2. **Frontend**: Agregar tipo en `src/lib/api.ts`
3. **Frontend**: Crear página en `src/pages/`
4. **Frontend**: Agregar función de fetch en `src/lib/api.ts`
5. **Frontend**: Actualizar navegación

### Ejemplo - Agregar Cruceros:
```typescript
// 1. Tipo en api.ts
export interface Cruise {
  id: string;
  name: string;
  description: string;
  price: number;
  cruise: {
    departure: string;
    arrival: string;
    duration: string;
    ship: string;
    ports: string[];
  };
}

// 2. Función de fetch
export async function getCruises(): Promise<Cruise[]> {
  const res = await fetch('http://localhost:3000/api/cruises');
  if (!res.ok) throw new Error('Failed to fetch cruises');
  return res.json();
}

// 3. Página Cruises.tsx
// 4. Actualizar navegación
```

### Estilos y Componentes

#### Tailwind CSS
- **Utility-first**: Usar clases directamente en JSX
- **Responsive**: Prefijos `sm:`, `md:`, `lg:`, `xl:`
- **Custom**: Configurar en `tailwind.config.ts`

#### shadcn/ui
- **Instalación**: `npx shadcn-ui@latest add [component]`
- **Personalización**: Modificar en `src/components/ui/`
- **Temas**: Configurar en `tailwind.config.ts`

### Mejores Prácticas

#### TypeScript
- **Tipos estrictos**: Definir interfaces para todos los datos
- **Props tipadas**: Usar interfaces para props de componentes
- **API tipada**: Definir tipos de respuesta de API

#### React
- **Hooks personalizados**: Para lógica reutilizable
- **Contextos**: Para estado global
- **Componentes puros**: Cuando sea posible

#### Performance
- **Lazy loading**: Para páginas grandes
- **Memoización**: Usar `useMemo` y `useCallback`
- **Optimización de imágenes**: Usar formatos modernos

---

## 📜 Scripts Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Linting y TypeScript
```bash
# Verificar tipos TypeScript
npm run type-check

# Linting con ESLint
npm run lint

# Linting con auto-fix
npm run lint:fix
```

### Build y Deploy
```bash
# Build optimizado para producción
npm run build

# Analizar bundle
npm run analyze
```

---

## 🐛 Troubleshooting

### Problemas Comunes

#### Error 401 - Unauthorized
- **Causa**: Token expirado o inválido
- **Solución**: Hacer logout y login nuevamente

#### Error de CORS
- **Causa**: Backend no configurado correctamente
- **Solución**: Verificar que el backend esté en `localhost:3000`

#### Datos no se cargan
- **Causa**: Backend no ejecutándose
- **Solución**: Iniciar el servidor backend

#### Errores de TypeScript
- **Causa**: Tipos desactualizados
- **Solución**: Ejecutar `npm run type-check`

### Debugging

#### Herramientas de Desarrollo
- **React DevTools**: Para inspeccionar componentes
- **Redux DevTools**: Para estado global (si se usa)
- **Network tab**: Para peticiones HTTP
- **Console**: Para logs y errores

#### Logs Útiles
```typescript
// En funciones de API
console.log('API Response:', data);

// En componentes
console.log('Component State:', state);

// En contextos
console.log('Context Update:', newValue);
```

---

## 📞 Soporte

### Recursos
- **Documentación de React**: https://react.dev/
- **Documentación de TypeScript**: https://www.typescriptlang.org/
- **Documentación de Tailwind**: https://tailwindcss.com/
- **Documentación de shadcn/ui**: https://ui.shadcn.com/

### Contacto
- **Issues**: Crear issue en el repositorio
- **Discusiones**: Usar GitHub Discussions
- **Documentación**: Mantener actualizada esta documentación

---

*Última actualización: Enero 2025* 