import { useQuery } from "@tanstack/react-query";
import type { Value } from "@shared/schema";

export default function ValuesSection() {
  const { data: values = [], isLoading } = useQuery<Value[]>({
    queryKey: ["/api/values"],
  });

  const getIconColorClass = (index: number) => {
    const colors = ["text-green-600", "text-blue-600", "text-yellow-600", "text-purple-600"];
    return colors[index % colors.length];
  };

  const getBackgroundColorClass = (index: number) => {
    const backgrounds = ["bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-purple-100"];
    return backgrounds[index % backgrounds.length];
  };

  if (isLoading) {
    return (
      <section id="values" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-xl animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="values" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These principles guide every decision we make and every service we provide
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={value.id} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className={`${getBackgroundColorClass(index)} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${value.icon} text-2xl ${getIconColorClass(index)}`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
