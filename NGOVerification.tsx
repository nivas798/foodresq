import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NGOVerificationProps {
  onVerify: () => void;
  onBack: () => void;
}

const NGOVerification = ({ onVerify, onBack }: NGOVerificationProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "ngo@example.com" && password === "password123") {
      onVerify();
    } else {
      alert("Invalid NGO credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">NGO Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ngo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack} className="w-1/2">
                Back
              </Button>
              <Button type="submit" className="w-1/2">
                Verify
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOVerification;
