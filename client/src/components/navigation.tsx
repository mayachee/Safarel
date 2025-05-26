import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">LogiFlow</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('overview')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollToSection('values')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Values
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('team')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Team
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button className="bg-primary text-white hover:bg-blue-700">
                Admin Dashboard
              </Button>
            </Link>
            <button className="md:hidden text-gray-600 hover:text-primary">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
