import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, MapPin, Star, Wifi, Car, Coffee } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ShoppingCartComponent from "@/components/ShoppingCart";
import AuthComponent from "@/components/AuthComponent";
import { useEffect, useState } from "react";
import { getHotels, Hotel as HotelType } from "@/lib/api";

const Hotels = () => {
  const { addToCart, isLoggedIn } = useCart();
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHotels()
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="bg-green-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">TravelHub</span>
              </a>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/flights" className="text-gray-600 hover:text-gray-900">Vuelos</a>
              <a href="/hotels" className="text-green-600 font-medium">Hoteles</a>
              <a href="/transport" className="text-gray-600 hover:text-gray-900">Transporte</a>
              <a href="/experiences" className="text-gray-600 hover:text-gray-900">Experiencias</a>
              <div className="flex items-center space-x-3">
                <AuthComponent />
                {isLoggedIn && <ShoppingCartComponent />}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Sección Principal */}
      <section className="bg-green-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Encuentra tu Alojamiento Perfecto</h2>
            <p className="text-green-100">Hoteles de calidad para tu estancia ideal</p>
          </div>
        </div>
      </section>

      {/* Sección de Resultados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Hoteles Disponibles</h3>
            {loading ? (
              <div className="text-center text-gray-500">Cargando hoteles...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">{hotel.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.hotel.location || '-'}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{hotel.hotel.rating || '-'}</span>
                            <span className="text-sm text-gray-500">({hotel.hotel.reviews || 0})</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{hotel.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(hotel.hotel.amenities || []).map((amenity: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">${hotel.price}</span>
                          <span className="text-sm text-gray-600">/noche</span>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => addToCart({
                              id: hotel.id,
                              name: hotel.name,
                              price: hotel.price,
                              type: 'HOTEL',
                              description: hotel.description,
                              details: hotel
                            })}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Agregar al Carrito
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hotels;
