import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Overview } from "@shared/schema";

export default function HeroSection() {
  const { data: overview, isLoading } = useQuery<Overview>({
    queryKey: ["/api/overview"],
  });

  if (isLoading) {
    return (
      <section id="overview" className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-6"></div>
            <div className="h-6 bg-white/20 rounded mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-white/20 rounded"></div>
              <div className="h-12 w-32 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="overview" className="bg-gradient-to-br from-primary to-secondary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {overview?.title || "Loading..."}
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {overview?.description || "Loading..."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-accent text-white hover:bg-yellow-500">
                Get Quote
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Modern truck on European highway" 
              className="rounded-xl shadow-2xl w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
