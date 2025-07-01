import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock, Star, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ShoppingCartComponent from "@/components/ShoppingCart";
import AuthComponent from "@/components/AuthComponent";
import { useEffect, useState } from "react";
import { getExperiences, Experience as ExperienceType } from "@/lib/api";

const Experiences = () => {
  const { addToCart, isLoggedIn } = useCart();
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExperiences()
      .then((data) => {
        setExperiences(data);
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
                <div className="bg-orange-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">TravelHub</span>
              </a>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/flights" className="text-gray-600 hover:text-gray-900">Vuelos</a>
              <a href="/hotels" className="text-gray-600 hover:text-gray-900">Hoteles</a>
              <a href="/transport" className="text-gray-600 hover:text-gray-900">Transporte</a>
              <a href="/experiences" className="text-orange-600 font-medium">Experiencias</a>
              <div className="flex items-center space-x-3">
                <AuthComponent />
                {isLoggedIn && <ShoppingCartComponent />}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Sección Principal */}
      <section className="bg-orange-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Descubre Experiencias Increíbles</h2>
            <p className="text-orange-100">Actividades únicas que harán de tu viaje algo inolvidable</p>
          </div>
        </div>
      </section>

      {/* Sección de Categorías y Resultados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            <h3 className="text-2xl font-bold text-gray-900 mb-8">Experiencias Disponibles</h3>
            {loading ? (
              <div className="text-center text-gray-500">Cargando experiencias...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <Card key={experience.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <CardHeader>
                      <CardTitle>{experience.name}</CardTitle>
                      <CardDescription>{experience.excursion.location || '-'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{experience.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {experience.excursion.category || 'Excursión'}
                        </Badge>
                        {experience.excursion.difficulty && (
                          <Badge variant="outline" className="text-xs">{experience.excursion.difficulty}</Badge>
                        )}
                        {experience.excursion.duration && (
                          <Badge variant="outline" className="text-xs">{experience.excursion.duration}</Badge>
                        )}
                      </div>
                      {experience.excursion.includes && experience.excursion.includes.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {experience.excursion.includes.map((inc, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{inc}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-orange-600">${experience.price}</span>
                          <span className="text-sm text-gray-600">/persona</span>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => addToCart({
                              id: experience.id,
                              name: experience.name,
                              price: experience.price,
                              type: 'EXPERIENCE',
                              description: experience.description,
                              details: experience
                            })}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
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

export default Experiences;
