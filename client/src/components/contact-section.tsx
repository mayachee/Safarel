import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin } from "lucide-react";
import type { InsertContactSubmission } from "@shared/schema";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    serviceInterest: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Message sent successfully!", 
        description: "We'll get back to you soon." 
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        serviceInterest: "",
        message: "",
      });
    },
    onError: () => {
      toast({ 
        title: "Failed to send message", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8">
              Ready to streamline your logistics? Contact us for a personalized consultation and quote.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Phone</p>
                  <p className="text-gray-600">+34 900 123 456</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-gray-600">contact@logiflow.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Address</p>
                  <p className="text-gray-600">Barcelona, Spain</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="John" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Doe" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john.doe@company.com" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your Company" 
                />
              </div>
              
              <div>
                <Label htmlFor="serviceInterest">Service Interest</Label>
                <Select
                  value={formData.serviceInterest}
                  onValueChange={(value) => handleInputChange("serviceInterest", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transportation">Transportation Services</SelectItem>
                    <SelectItem value="it-management">IT Fleet Management</SelectItem>
                    <SelectItem value="tracking">Tracking Services</SelectItem>
                    <SelectItem value="all-services">All Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about your logistics needs..." 
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-white hover:bg-blue-700"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
