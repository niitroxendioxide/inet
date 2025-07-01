import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Bus, Train } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ShoppingCartComponent from "@/components/ShoppingCart";
import AuthComponent from "@/components/AuthComponent";
import { useEffect, useState } from "react";
import { getTransport, Transport as TransportType } from "@/lib/api";

const Transport = () => {
  const { addToCart, isLoggedIn } = useCart();
  const [transport, setTransport] = useState<TransportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransport()
      .then((data) => {
        setTransport(data);
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
                <div className="bg-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">TravelHub</span>
              </a>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/flights" className="text-gray-600 hover:text-gray-900">Vuelos</a>
              <a href="/hotels" className="text-gray-600 hover:text-gray-900">Hoteles</a>
              <a href="/transport" className="text-purple-600 font-medium">Transporte</a>
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
      <section className="bg-purple-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Encuentra tu Transporte</h2>
            <p className="text-purple-100">Opciones de transporte para todos tus viajes</p>
          </div>
        </div>
      </section>

      {/* Sección de Resultados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Transportes Disponibles</h3>
            {loading ? (
              <div className="text-center text-gray-500">Cargando transportes...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {transport.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="mt-2">
                            <Badge variant="secondary">{item.transport.vehicleType}</Badge>
                            {item.transport.capacity && (
                              <span className="ml-2 text-xs text-gray-500">Capacidad: {item.transport.capacity}</span>
                            )}
                            {item.transport.duration && (
                              <span className="ml-2 text-xs text-gray-500">Duración: {item.transport.duration}</span>
                            )}
                          </div>
                          {item.transport.includes && item.transport.includes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.transport.includes.map((inc, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{inc}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-purple-600">${item.price}</span>
                          <span className="text-sm text-gray-600">/servicio</span>
                          <div className="space-x-2 mt-2">
                            <Button 
                              variant="outline" 
                              onClick={() => addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                type: 'TRANSPORT',
                                description: item.description,
                                details: item
                              })}
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
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

export default Transport;
