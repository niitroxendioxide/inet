import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Plane, Hotel, Car, Camera } from "lucide-react";
import ShoppingCartComponent from "@/components/ShoppingCart";
import AuthComponent from "@/components/AuthComponent";
import { getPackages } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useCart();

  useEffect(() => {
    getPackages()
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de Navegación */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/flights" className="text-gray-600 hover:text-gray-900 transition-colors">Vuelos</a>
              <a href="/hotels" className="text-gray-600 hover:text-gray-900 transition-colors">Hoteles</a>
              <a href="/transport" className="text-gray-600 hover:text-gray-900 transition-colors">Transporte</a>
              <a href="/experiences" className="text-gray-600 hover:text-gray-900 transition-colors">Experiencias</a>
            </nav>

            <div className="flex items-center space-x-3">
              <AuthComponent />
              {isLoggedIn && <ShoppingCartComponent />}
            </div>
          </div>
        </div>
      </header>

      {/* Sección Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              ¡Bienvenido a TravelHub!
              <span className="block text-blue-600">
                Tu aventura comienza aquí
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explora y reserva vuelos, encuentra alojamientos perfectos, elige tu transporte ideal y descubre experiencias únicas alrededor del mundo. ¡Empieza a planear tu próximo viaje con un solo clic!
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Navegación Destacada */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">¿Qué quieres hacer hoy?</h3>
            <p className="text-xl text-gray-600">Accede rápidamente a las principales secciones de la plataforma</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <a href="/flights">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-blue-50 overflow-hidden cursor-pointer">
                <CardContent className="flex flex-col items-center py-8">
                  <Plane className="h-10 w-10 text-blue-600 mb-4" />
                  <span className="text-lg font-semibold text-blue-700">Vuelos</span>
                </CardContent>
              </Card>
            </a>
            <a href="/hotels">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-green-50 overflow-hidden cursor-pointer">
                <CardContent className="flex flex-col items-center py-8">
                  <Hotel className="h-10 w-10 text-green-600 mb-4" />
                  <span className="text-lg font-semibold text-green-700">Hoteles</span>
                </CardContent>
              </Card>
            </a>
            <a href="/transport">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-purple-50 overflow-hidden cursor-pointer">
                <CardContent className="flex flex-col items-center py-8">
                  <Car className="h-10 w-10 text-purple-600 mb-4" />
                  <span className="text-lg font-semibold text-purple-700">Transporte</span>
                </CardContent>
              </Card>
            </a>
            <a href="/experiences">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-orange-50 overflow-hidden cursor-pointer">
                <CardContent className="flex flex-col items-center py-8">
                  <Camera className="h-10 w-10 text-orange-600 mb-4" />
                  <span className="text-lg font-semibold text-orange-700">Experiencias</span>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold">TravelHub</h4>
              </div>
              <p className="text-slate-400">Tu puerta de entrada a experiencias de viaje extraordinarias alrededor del mundo.</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Destinos</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Europa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">América</a></li>
                <li><a href="#" className="hover:text-white transition-colors">África</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Servicios</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/flights" className="hover:text-white transition-colors">Reserva de Vuelos</a></li>
                <li><a href="/hotels" className="hover:text-white transition-colors">Reservas de Hoteles</a></li>
                <li><a href="/transport" className="hover:text-white transition-colors">Alquiler de Autos</a></li>
                <li><a href="/experiences" className="hover:text-white transition-colors">Experiencias de Viaje</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Soporte</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contáctanos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TravelHub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
