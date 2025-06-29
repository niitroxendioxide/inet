import { PrismaClient, ProductType, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Limpiar la base de datos
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.package.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.excursion.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Database cleaned');

  // Crear usuarios con contraseñas hasheadas correctamente
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@travelhub.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      email: 'client@travelhub.com',
      password: clientPassword,
      name: 'Client User',
      role: UserRole.CLIENT,
    },
  });

  console.log('�� Users created');

  // Crear vuelos
  const flight1 = await prisma.product.create({
    data: {
      name: 'Vuelo Buenos Aires - Madrid',
      description: 'Vuelo directo desde Buenos Aires a Madrid con todas las comodidades',
      price: 1200.00,
      type: ProductType.FLIGHT,
      flight: {
        create: {
          from: 'Buenos Aires',
          to: 'Madrid',
          departure: '22:00',
          arrival: '14:30',
          duration: '11h 30m',
          class: 'Económica',
          stops: 'Directo',
          airline: 'Iberia',
          flightNumber: 'IB6845',
        },
      },
    },
    include: { flight: true },
  });

  const flight2 = await prisma.product.create({
    data: {
      name: 'Vuelo Madrid - París',
      description: 'Vuelo corto desde Madrid a París',
      price: 180.00,
      type: ProductType.FLIGHT,
      flight: {
        create: {
          from: 'Madrid',
          to: 'París',
          departure: '08:30',
          arrival: '11:15',
          duration: '2h 45m',
          class: 'Económica',
          stops: 'Directo',
          airline: 'Air France',
          flightNumber: 'AF1234',
        },
      },
    },
    include: { flight: true },
  });

  const flight3 = await prisma.product.create({
    data: {
      name: 'Vuelo París - Roma',
      description: 'Vuelo desde París a Roma con escala',
      price: 220.00,
      type: ProductType.FLIGHT,
      flight: {
        create: {
          from: 'París',
          to: 'Roma',
          departure: '10:00',
          arrival: '14:30',
          duration: '4h 30m',
          class: 'Económica',
          stops: '1 escala',
          airline: 'Alitalia',
          flightNumber: 'AZ5678',
        },
      },
    },
    include: { flight: true },
  });

  console.log('✈️ Flights created');

  // Crear hoteles
  const hotel1 = await prisma.product.create({
    data: {
      name: 'Hotel Plaza Madrid',
      description: 'Hotel de lujo en el centro de Madrid con vistas espectaculares',
      price: 150.00,
      type: ProductType.HOTEL,
      hotel: {
        create: {
          location: 'Madrid, España',
          rating: 4.8,
          reviews: 1250,
          amenities: ['WiFi', 'Piscina', 'Gimnasio', 'Restaurante', 'Spa', 'Estacionamiento'],
          checkIn: '15:00',
          checkOut: '11:00',
          rooms: 200,
          stars: 5,
        },
      },
    },
    include: { hotel: true },
  });

  const hotel2 = await prisma.product.create({
    data: {
      name: 'Hotel Eiffel Paris',
      description: 'Hotel boutique cerca de la Torre Eiffel',
      price: 200.00,
      type: ProductType.HOTEL,
      hotel: {
        create: {
          location: 'París, Francia',
          rating: 4.6,
          reviews: 890,
          amenities: ['WiFi', 'Restaurante', 'Bar', 'Terraza', 'Servicio de habitaciones'],
          checkIn: '14:00',
          checkOut: '12:00',
          rooms: 50,
          stars: 4,
        },
      },
    },
    include: { hotel: true },
  });

  const hotel3 = await prisma.product.create({
    data: {
      name: 'Hotel Colosseo Roma',
      description: 'Hotel histórico cerca del Coliseo',
      price: 180.00,
      type: ProductType.HOTEL,
      hotel: {
        create: {
          location: 'Roma, Italia',
          rating: 4.7,
          reviews: 1100,
          amenities: ['WiFi', 'Desayuno', 'Terraza', 'Servicio de concierge', 'Tour guiado'],
          checkIn: '15:00',
          checkOut: '11:00',
          rooms: 80,
          stars: 4,
        },
      },
    },
    include: { hotel: true },
  });

  console.log('🏨 Hotels created');

  // Crear transportes
  const transport1 = await prisma.product.create({
    data: {
      name: 'Traslado Aeropuerto Madrid',
      description: 'Servicio de traslado privado desde el aeropuerto de Madrid',
      price: 45.00,
      type: ProductType.TRANSPORT,
      transport: {
        create: {
          vehicleType: 'Sedán',
          capacity: 4,
          pickupLocation: 'Aeropuerto Madrid-Barajas',
          dropoffLocation: 'Centro de Madrid',
          duration: '30 min',
          includes: ['Conductor profesional', 'Combustible', 'Seguro', 'WiFi'],
        },
      },
    },
    include: { transport: true },
  });

  const transport2 = await prisma.product.create({
    data: {
      name: 'Tour en Bus París',
      description: 'Tour panorámico en bus por los principales monumentos de París',
      price: 35.00,
      type: ProductType.TRANSPORT,
      transport: {
        create: {
          vehicleType: 'Bus turístico',
          capacity: 50,
          pickupLocation: 'Centro de París',
          dropoffLocation: 'Centro de París',
          duration: '3 horas',
          includes: ['Guía turístico', 'Audioguía', 'Paradas en monumentos', 'Fotos'],
        },
      },
    },
    include: { transport: true },
  });

  const transport3 = await prisma.product.create({
    data: {
      name: 'Alquiler de Auto Roma',
      description: 'Alquiler de auto compacto para explorar Roma y alrededores',
      price: 60.00,
      type: ProductType.TRANSPORT,
      transport: {
        create: {
          vehicleType: 'Auto compacto',
          capacity: 5,
          pickupLocation: 'Aeropuerto Roma-Fiumicino',
          dropoffLocation: 'Aeropuerto Roma-Fiumicino',
          duration: '24 horas',
          includes: ['Seguro completo', 'GPS', 'Kilometraje ilimitado', 'Asistencia 24h'],
        },
      },
    },
    include: { transport: true },
  });

  console.log('🚗 Transport created');

  // Crear experiencias
  const experience1 = await prisma.product.create({
    data: {
      name: 'Tour Flamenco Madrid',
      description: 'Experiencia auténtica de flamenco en tablao tradicional',
      price: 75.00,
      type: ProductType.EXCURSION,
      excursion: {
        create: {
          location: 'Madrid, España',
          category: 'Cultura',
          duration: '2 horas',
          maxGroupSize: 20,
          difficulty: 'Fácil',
          includes: ['Show de flamenco', 'Bebida', 'Tapas', 'Guía local'],
          requirements: ['Reserva previa', 'Código de vestimenta casual'],
        },
      },
    },
    include: { excursion: true },
  });

  const experience2 = await prisma.product.create({
    data: {
      name: 'Tour del Vino París',
      description: 'Degustación de vinos franceses en bodegas tradicionales',
      price: 120.00,
      type: ProductType.EXCURSION,
      excursion: {
        create: {
          location: 'París, Francia',
          category: 'Gastronomía',
          duration: '4 horas',
          maxGroupSize: 12,
          difficulty: 'Fácil',
          includes: ['Degustación de vinos', 'Quesos franceses', 'Transporte', 'Sommelier'],
          requirements: ['Mayor de 18 años', 'Reserva con 24h de anticipación'],
        },
      },
    },
    include: { excursion: true },
  });

  const experience3 = await prisma.product.create({
    data: {
      name: 'Tour del Vaticano Roma',
      description: 'Visita guiada a los Museos Vaticanos y Capilla Sixtina',
      price: 85.00,
      type: ProductType.EXCURSION,
      excursion: {
        create: {
          location: 'Roma, Italia',
          category: 'Historia',
          duration: '3 horas',
          maxGroupSize: 15,
          difficulty: 'Fácil',
          includes: ['Entrada sin colas', 'Guía oficial', 'Audioguía', 'Fotos permitidas'],
          requirements: ['Vestimenta apropiada', 'Documento de identidad'],
        },
      },
    },
    include: { excursion: true },
  });

  console.log('🎭 Experiences created');

  // Crear paquetes
  const package1 = await prisma.package.create({
    data: {
      name: 'Paquete Madrid Completo',
      description: 'Vuelo + Hotel + Transporte + Experiencia en Madrid',
      price: 1450.00,
      products: {
        connect: [
          { id: flight1.id },
          { id: hotel1.id },
          { id: transport1.id },
          { id: experience1.id },
        ],
      },
    },
    include: { products: true },
  });

  const package2 = await prisma.package.create({
    data: {
      name: 'Paquete París Romántico',
      description: 'Vuelo + Hotel + Tour en bus + Experiencia gastronómica',
      price: 1680.00,
      products: {
        connect: [
          { id: flight2.id },
          { id: hotel2.id },
          { id: transport2.id },
          { id: experience2.id },
        ],
      },
    },
    include: { products: true },
  });

  const package3 = await prisma.package.create({
    data: {
      name: 'Paquete Roma Histórico',
      description: 'Vuelo + Hotel + Alquiler de auto + Tour del Vaticano',
      price: 1520.00,
      products: {
        connect: [
          { id: flight3.id },
          { id: hotel3.id },
          { id: transport3.id },
          { id: experience3.id },
        ],
      },
    },
    include: { products: true },
  });

  console.log('📦 Packages created');

  // Crear carrito de ejemplo para el cliente
  const cart = await prisma.cart.create({
    data: {
      userId: clientUser.id,
      items: {
        create: [
          {
            productId: flight1.id,
            quantity: 2,
          },
          {
            productId: hotel1.id,
            quantity: 3,
          },
          {
            packageId: package1.id,
            quantity: 1,
          },
        ],
      },
    },
    include: {
      items: {
        include: {
          product: true,
          package: true,
        },
      },
    },
  });

  console.log('🛒 Cart created');

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: 2 (1 admin, 1 client)`);
  console.log(`- Flights: 3`);
  console.log(`- Hotels: 3`);
  console.log(`- Transport: 3`);
  console.log(`- Experiences: 3`);
  console.log(`- Packages: 3`);
  console.log(`- Cart items: 3`);
  console.log('\n🔑 Login credentials:');
  console.log('Admin: admin@travelhub.com / admin123');
  console.log('Client: client@travelhub.com / client123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 