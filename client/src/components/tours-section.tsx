import { useQuery } from "@tanstack/react-query";
import type { TourDate } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToursSection() {
  const { data: tourDates, isLoading, error } = useQuery<TourDate[]>({
    queryKey: ['/api/tour-dates']
  });

  if (error) {
    return (
      <section id="tours" className="section-padding metal-gradient">
        <div className="container-padding">
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">PERFORMANCE DATES</h2>
          <div className="text-center text-red-500">
            <p>Failed to load performance dates. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tours" className="section-padding metal-gradient">
      <div className="container-padding">
        <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">PERFORMANCE DATES</h2>
        
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="bg-black border border-metal-gold/20 rounded-lg p-8 md:p-12 text-center">
              <Skeleton className="h-8 md:h-12 w-32 md:w-48 mx-auto mb-4" />
              <Skeleton className="h-4 w-48 md:w-64 mx-auto" />
            </div>
          ) : (
            <div className="bg-black border border-metal-gold/20 rounded-lg p-8 md:p-12 text-center">
              <i className="fas fa-calendar-alt text-3xl md:text-4xl text-metal-gold mb-4 md:mb-6"></i>
              <h3 className="text-xl md:text-3xl font-metal text-metal-gold mb-3 md:mb-4">TO BE ANNOUNCED</h3>
              <p className="text-gray-300 text-base md:text-lg mb-4 md:mb-6 px-2">
                New performance dates are being scheduled. Stay tuned for announcements!
              </p>
              <div className="text-xs md:text-sm text-gray-400 px-2">
                Follow us on social media for the latest updates on upcoming shows
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
