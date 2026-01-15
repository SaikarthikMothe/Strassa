import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Book a Ride",
    subtitle: "Fast and reliable rides",
    image: "/assets/ride.png",
    path: "/home",
  },
  {
    title: "Mobile Fuel",
    subtitle: "Fuel delivered anywhere",
    image: "/assets/fuel.png",
    path: "/fuel/request",
  },
  {
    title: "Repair Call",
    subtitle: "Emergency roadside assistance",
    image: "/assets/repair.png",
    path: "/repair",
    tag: "NEW",
  },
];

const ServiceHeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {services.map((service, i) => (
          <div key={i} className="min-w-full px-4">
            <div
              onClick={() => navigate(service.path)}
              className="bg-gray-100 rounded-3xl p-6 flex items-center justify-between cursor-pointer active:scale-[0.98] transition"
            >
              {/* Text */}
              <div>
                {service.tag && (
                  <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded-full mb-2">
                    {service.tag}
                  </span>
                )}
                <h2 className="text-2xl font-semibold">
                  {service.title}
                </h2>
                <p className="text-gray-500 mt-1">
                  {service.subtitle}
                </p>
              </div>

              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="h-24 w-24 object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {services.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceHeroCarousel;
