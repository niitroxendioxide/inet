import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ShoppingCartComponent from "@/components/ShoppingCart";
import AuthComponent from "@/components/AuthComponent";
import { useEffect, useState } from "react";
import { getFlights, Flight } from "@/lib/api";

const Flights = () => {
  const { addToCart, isLoggedIn } = useCart();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFlights()
      .then((data) => {
        setFlights(data);
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
                <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">TravelHub</span>
              </a>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/flights" className="text-blue-600 font-medium">Vuelos</a>
              <a href="/hotels" className="text-gray-600 hover:text-gray-900">Hoteles</a>
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
      <section className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Encuentra tu Vuelo Perfecto</h2>
            <p className="text-blue-100">Los mejores vuelos a los destinos más increíbles</p>
          </div>
        </div>
      </section>

      {/* Sección de Resultados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Vuelos Disponibles</h3>
            {loading ? (
              <div className="text-center text-gray-500">Cargando vuelos...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Plane className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{flight.name}</h4>
                              <p className="text-sm text-gray-600">{flight.flight.class || 'Económica'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{flight.flight.departure || '-'}</p>
                              <p className="text-sm text-gray-600">{flight.flight.from || '-'}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                                <div className="flex-1 h-0.5 bg-gray-300"></div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                                <div className="flex-1 h-0.5 bg-gray-300"></div>
                                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="flex items-center justify-center space-x-2 mt-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{flight.flight.duration || '-'}</span>
                              </div>
                              <Badge variant="secondary" className="mt-1">{flight.flight.stops || 'Directo'}</Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{flight.flight.arrival || '-'}</p>
                              <p className="text-sm text-gray-600">{flight.flight.to || '-'}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-4">{flight.description}</p>
                        </div>
                        <div className="text-right ml-8">
                          <p className="text-3xl font-bold text-blue-600">${flight.price}</p>
                          <p className="text-sm text-gray-600 mb-4">por persona</p>
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => addToCart({
                                id: flight.id,
                                name: flight.name,
                                price: flight.price,
                                type: 'FLIGHT',
                                description: flight.description,
                                details: flight
                              })}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              Agregar al Carrito
                            </Button>
                          </div>
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

export default Flights;
