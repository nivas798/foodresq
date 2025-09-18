import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, MapPin, Package, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RestaurantFormProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

interface FormData {
  restaurantName: string;
  contactPerson: string;
  phone: string;
  foodType: string;
  description: string;
  quantity: string;
  expiryTime: string;
  address: string;
  pickupInstructions: string;
}

export default function RestaurantForm({ onBack, onSubmit }: RestaurantFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    restaurantName: "",
    contactPerson: "",
    phone: "",
    foodType: "",
    description: "",
    quantity: "",
    expiryTime: "",
    address: "",
    pickupInstructions: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['restaurantName', 'contactPerson', 'phone', 'foodType', 'quantity', 'expiryTime', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'available'
    });

    toast({
      title: "Food Listed Successfully!",
      description: "Your surplus food has been made available to NGOs in your area.",
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          onClick={onBack}
          variant="outline"
          className="mb-6 bg-card/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="form-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">
              List Your Surplus Food
            </CardTitle>
            <p className="text-muted-foreground">
              Help reduce food waste and feed those in need in your community
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Restaurant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Restaurant Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="restaurantName">Restaurant Name *</Label>
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      placeholder="e.g., Tasty Treats Cafe"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g., John Manager"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +91 9876543210"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Food Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="w-5 h-5 mr-2 text-secondary" />
                  Food Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foodType">Food Type *</Label>
                    <Input
                      id="foodType"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleInputChange}
                      placeholder="e.g., Mixed Vegetarian Meals"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity (Servings) *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 50 servings"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Food Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the food items, dietary restrictions, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expiryTime" className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Best Before Time *
                  </Label>
                  <Input
                    id="expiryTime"
                    name="expiryTime"
                    type="datetime-local"
                    value={formData.expiryTime}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Pickup Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-accent" />
                  Pickup Details
                </h3>
                
                <div>
                  <Label htmlFor="address">Pickup Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Complete address with landmarks"
                    className="mt-1"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
                  <Textarea
                    id="pickupInstructions"
                    name="pickupInstructions"
                    value={formData.pickupInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for pickup (parking, contact details, etc.)"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-primary text-white font-semibold py-3 text-lg shadow-glow hover:shadow-glow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Listing Food...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    List Food for Donation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}