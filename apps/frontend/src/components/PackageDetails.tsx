
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, Hotel, Car, Camera, MapPin, Calendar, Users, Star, Clock, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PackageDetailsProps {
  packageData: {
    id: string;
    name: string;
    destination: string;
    duration: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    highlights: string[];
    includes: {
      flights?: boolean;
      hotels?: boolean;
      transport?: boolean;
      experiences?: boolean;
    };
    itinerary: Array<{
      day: number;
      title: string;
      activities: string[];
    }>;
  };
  trigger: React.ReactNode;
}

const PackageDetails = ({ packageData, trigger }: PackageDetailsProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: packageData.id,
      name: packageData.name,
      price: packageData.price,
      type: 'PACKAGE',
      image: packageData.image,
      description: packageData.description,
      details: {
        destination: packageData.destination,
        duration: packageData.duration,
        rating: packageData.rating,
        highlights: packageData.highlights,
        includes: packageData.includes,
        itinerary: packageData.itinerary
      }
    });
  };

  const getIncludeIcon = (type: string) => {
    switch (type) {
      case 'flights': return <Plane className="h-4 w-4" />;
      case 'hotels': return <Hotel className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'experiences': return <Camera className="h-4 w-4" />;
      default: return null;
    }
  };

  const getIncludeLabel = (type: string) => {
    switch (type) {
      case 'flights': return 'Vuelos';
      case 'hotels': return 'Alojamiento';
      case 'transport': return 'Transporte';
      case 'experiences': return 'Experiencias';
      default: return '';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{packageData.name}</DialogTitle>
          <DialogDescription className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{packageData.destination}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{packageData.duration}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{packageData.rating} ({packageData.reviews} reseñas)</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Image */}
          <div className="relative">
            <img 
              src={packageData.image} 
              alt={packageData.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-600">${packageData.price}</span>
                {packageData.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${packageData.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">por persona</p>
            </div>
            <Button 
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Agregar al Carrito
            </Button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700">{packageData.description}</p>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-lg font-semibold mb-3">¿Qué Incluye?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(packageData.includes).map(([key, included]) => (
                included && (
                  <div key={key} className="flex items-center space-x-2 text-green-600">
                    {getIncludeIcon(key)}
                    <span className="text-sm font-medium">{getIncludeLabel(key)}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Puntos Destacados</h3>
            <ul className="space-y-2">
              {packageData.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Itinerario</h3>
            <div className="space-y-4">
              {packageData.itinerary.map((day) => (
                <Card key={day.day} className="border-l-4 border-l-green-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Día {day.day}: {day.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="text-sm text-gray-700">• {activity}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetails;
