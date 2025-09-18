import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Clock, MapPin, Package, Phone, Users, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodListing {
  id: string;
  restaurantName: string;
  contactPerson: string;
  phone: string;
  foodType: string;
  description: string;
  quantity: string;
  expiryTime: string;
  address: string;
  pickupInstructions: string;
  submittedAt: string;
  status: 'available' | 'claimed' | 'expired';
}

interface NGODashboardProps {
  onBack: () => void;
  foodListings: FoodListing[];
  onClaimFood: (listingId: string) => void;
}

export default function NGODashboard({ onBack, foodListings, onClaimFood }: NGODashboardProps) {
  const { toast } = useToast();
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // ✅ Only show items that are still available
  const availableListings = foodListings.filter(listing => listing.status === 'available');

  const formatTimeLeft = (expiryTime: string) => {
    const expiry = new Date(expiryTime);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
  };

  const getUrgencyColor = (expiryTime: string) => {
    const expiry = new Date(expiryTime);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    const hoursLeft = diff / (1000 * 60 * 60);
    if (hoursLeft <= 1) return "destructive";
    if (hoursLeft <= 3) return "secondary";
    return "default";
  };

  const handleClaimFood = async () => {
    if (!selectedListing) return;
    setIsConfirming(true);

    // Simulate API call or Firestore update
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ✅ Call parent handler to set status to 'claimed'
    onClaimFood(selectedListing.id);

    toast({
      title: "Pickup Confirmed! ✅",
      description: `You have successfully claimed food from ${selectedListing.restaurantName}. Please coordinate pickup with the restaurant.`,
    });

    setIsConfirming(false);
    setSelectedListing(null);
  };

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button onClick={onBack} variant="outline" className="mb-6 bg-card/80 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="form-card animate-fade-in mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Available Food Donations
            </CardTitle>
            <p className="text-muted-foreground">
              Real-time surplus food listings from restaurants in your area
            </p>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4 shadow-card">
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              {availableListings.length}
            </div>
            <div className="text-sm text-muted-foreground">Available Now</div>
          </Card>

          <Card className="text-center p-4 shadow-card">
            <div className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent">
              {availableListings.reduce((total, listing) => {
                const match = listing.quantity.match(/\d+/);
                return total + (match ? parseInt(match[0]) : 0);
              }, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Servings</div>
          </Card>

          <Card className="text-center p-4 shadow-card">
            <div className="text-2xl font-bold text-accent">
              {availableListings.filter(l => getUrgencyColor(l.expiryTime) === 'destructive').length}
            </div>
            <div className="text-sm text-muted-foreground">Urgent (&lt; 1hr)</div>
          </Card>

          <Card className="text-center p-4 shadow-card">
            <div className="text-2xl font-bold text-primary">
              {new Set(availableListings.map(l => l.restaurantName)).size}
            </div>
            <div className="text-sm text-muted-foreground">Restaurants</div>
          </Card>
        </div>

        {/* Food Listings */}
        <div className="space-y-6">
          {availableListings.length === 0 ? (
            <Card className="food-card text-center py-12">
              <div className="animate-float">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Food Available Right Now</h3>
              <p className="text-muted-foreground">
                Check back later or encourage local restaurants to join UnavuLink
              </p>
            </Card>
          ) : (
            availableListings.map((listing, index) => (
              <Card
                key={listing.id}
                className="food-card animate-scale-in hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{listing.restaurantName}</h3>
                      <p className="text-muted-foreground flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Contact: {listing.contactPerson}
                      </p>
                    </div>

                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      <Badge variant={getUrgencyColor(listing.expiryTime)} className="mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeLeft(listing.expiryTime)}
                      </Badge>
                      {getUrgencyColor(listing.expiryTime) === 'destructive' && (
                        <div className="flex items-center text-red-500 text-sm">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgent
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Package className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-semibold">{listing.foodType}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {listing.description || "Fresh prepared food"}
                      </p>
                    </div>

                    <div>
                      <div className="text-lg font-semibold gradient-secondary bg-clip-text text-transparent mb-2">
                        {listing.quantity}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        {listing.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-accent mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{listing.address}</p>
                  </div>

                  {/* ✅ Claim button now opens confirmation dialog */}
                  <Button
                    className="w-full gradient-primary text-white font-semibold"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Claim This Food Donation
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Confirm Pickup
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to claim this food donation?
              </DialogDescription>
            </DialogHeader>

            {selectedListing && (
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{selectedListing.restaurantName}</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Food:</strong> {selectedListing.foodType}</div>
                    <div><strong>Quantity:</strong> {selectedListing.quantity}</div>
                    <div><strong>Contact:</strong> {selectedListing.contactPerson} ({selectedListing.phone})</div>
                    <div><strong>Best Before:</strong> {formatTimeLeft(selectedListing.expiryTime)}</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Please coordinate with the restaurant for pickup within the specified time. 
                    Make sure to follow food safety guidelines.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedListing(null)} disabled={isConfirming}>
                Cancel
              </Button>
              <Button onClick={handleClaimFood} disabled={isConfirming} className="gradient-primary text-white">
                {isConfirming ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Pickup
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
