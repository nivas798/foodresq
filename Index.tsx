// src/pages/Index.tsx
import { collection, addDoc, onSnapshot, updateDoc, doc, serverTimestamp, query, orderBy, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import RestaurantForm from "@/components/RestaurantForm";
import NGODashboard from "@/components/NGODashboard";
import NGOVerification from "@/components/NGOVerification";
import RestaurantVerification from "@/components/RestaurantVerification";

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
  submittedAt: any; // Firestore timestamp
  status: "available" | "claimed" | "expired";
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'restaurant' | 'ngo'>('home');
  const [ngoVerified, setNgoVerified] = useState(false);
  const [restaurantVerified, setRestaurantVerified] = useState(false);
  const [foodListings, setFoodListings] = useState<FoodListing[]>([]);

  // Listen to Firestore in real time (mapping ensures doc.id is authoritative)
  useEffect(() => {
    const q = query(collection(db, "foods"), orderBy("submittedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<FoodListing, "id">),
          id: d.id, // <--- put doc.id last so it cannot be overridden by a stored `id` field
        }));
        console.log("[Index] onSnapshot ->", items.map(i => ({ id: i.id, status: i.status })));
        setFoodListings(items);
      },
      (err) => {
        console.error("[Index] onSnapshot error:", err);
      }
    );
    return () => unsub();
  }, []);

  const handleRoleSelect = (role: 'restaurant' | 'ngo') => {
    if (role === "ngo") {
      setCurrentView("ngo");
      setNgoVerified(false);
    } else {
      setCurrentView("restaurant");
      setRestaurantVerified(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Add new food listing to Firestore
  const handleRestaurantSubmit = async (data: FoodListing) => {
    try {
      await addDoc(collection(db, "foods"), {
        ...data,
        submittedAt: serverTimestamp(),
        status: "available",
      });
    } catch (err) {
      console.error("[Index] addDoc failed:", err);
      // optional fallback: add to local state (not recommended long-term)
      setFoodListings(prev => [...prev, { ...data, id: `local-${Date.now()}` } as FoodListing]);
    } finally {
      setCurrentView('home');
    }
  };

  // Claim handler: optimistic update + persist to Firestore + rollback on failure
  const handleClaimFood = async (listingId: string) => {
    console.log("[Index] handleClaimFood called with id:", listingId);

    if (!listingId) {
      console.error("[Index] missing listingId");
      return;
    }

    // keep a snapshot of previous state for potential rollback
    const prevState = [...foodListings];

    // optimistic UI update
    setFoodListings(prev => prev.map(l => (l.id === listingId ? { ...l, status: "claimed" } : l)));
    console.log("[Index] optimistic local update applied for", listingId);

    try {
      const docRef = doc(db, "foods", listingId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        throw new Error(`Document not found for id ${listingId}`);
      }

      console.log("[Index] calling updateDoc for", listingId);
      await updateDoc(docRef, { status: "claimed" });
      console.log("[Index] updateDoc succeeded for", listingId);
      // onSnapshot will sync authoritative state
    } catch (err) {
      console.error("[Index] updateDoc failed for", listingId, err);
      // rollback local state
      setFoodListings(prevState);
      alert("Could not claim this listing — please try again. (See console for details.)");
    }
  };

  if (currentView === 'restaurant') {
    if (!restaurantVerified) {
      return (
        <RestaurantVerification
          onVerify={() => setRestaurantVerified(true)}
          onBack={handleBackToHome}
        />
      );
    }
    return (
      <RestaurantForm
        onBack={handleBackToHome}
        onSubmit={handleRestaurantSubmit}
      />
    );
  }

  if (currentView === 'ngo') {
    if (!ngoVerified) {
      return (
        <NGOVerification
          onVerify={() => setNgoVerified(true)}
          onBack={handleBackToHome}
        />
      );
    }
    return (
      <NGODashboard
        onBack={handleBackToHome}
        foodListings={foodListings}
        onClaimFood={handleClaimFood}
      />
    );
  }

  return <HeroSection onRoleSelect={handleRoleSelect} />;
};

export default Index;
