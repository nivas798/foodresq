import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, ArrowRight, Users } from "lucide-react";
import heroImage from "@/assets/hero-food-sharing.jpg";
import restaurantIcon from "@/assets/restaurant-icon.jpg";
import ngoIcon from "@/assets/ngo-icon.jpg";

interface HeroSectionProps {
  onRoleSelect: (role: 'restaurant' | 'ngo') => void;
}

export default function HeroSection({ onRoleSelect }: HeroSectionProps) {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={heroImage} 
          alt="Community food sharing" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            UnavuLink
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Connecting surplus food with those in need
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reduce food wastage and fight hunger by connecting restaurants, events, and caterers 
            with NGOs, shelters, and community kitchens in real-time.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card 
            className="hero-card group animate-scale-in"
            onClick={() => onRoleSelect('restaurant')}
            style={{ animationDelay: '0.2s' }}
          >
            <CardContent className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-glow transition-all duration-300">
                <img 
                  src={restaurantIcon} 
                  alt="Restaurant" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <ChefHat className="w-12 h-12 gradient-secondary text-white rounded-full p-2 mx-auto mb-4 animate-float" />
              
              <h3 className="text-2xl font-bold mb-4 text-foreground">Restaurant</h3>
              
              <p className="text-muted-foreground mb-6">
                List your surplus food and make a difference. Help reduce waste while feeding those in need.
              </p>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Quick 30-second food listing
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Track your social impact
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Earn CSR credits
                </div>
              </div>
              
              <Button className="gradient-secondary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                List Food Surplus
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hero-card group animate-scale-in"
            onClick={() => onRoleSelect('ngo')}
            style={{ animationDelay: '0.4s' }}
          >
            <CardContent className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-glow transition-all duration-300">
                <img 
                  src={ngoIcon} 
                  alt="NGO" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Users className="w-12 h-12 gradient-primary text-white rounded-full p-2 mx-auto mb-4 animate-float" style={{ animationDelay: '1s' }} />
              
              <h3 className="text-2xl font-bold mb-4 text-foreground">NGO / Shelter</h3>
              
              <p className="text-muted-foreground mb-6">
                Access fresh surplus food from nearby restaurants and help your community thrive.
              </p>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Real-time food notifications
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  One-tap pickup confirmation
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Transparent delivery tracking
                </div>
              </div>
              
              <Button className="gradient-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                Find Available Food
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-primary bg-clip-text text-transparent">50M+</div>
            <div className="text-sm text-muted-foreground">Tons Food Wasted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-secondary bg-clip-text text-transparent">189M</div>
            <div className="text-sm text-muted-foreground">People Hungry</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent">Real-time</div>
            <div className="text-sm text-muted-foreground">Food Matching</div>
          </div>
        </div>
      </div>
    </div>
  );
}