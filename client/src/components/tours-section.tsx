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
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">PERFORMANCE DATES</h2>
        
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="bg-black border border-metal-gold/20 rounded-lg p-12 text-center">
              <Skeleton className="h-12 w-48 mx-auto mb-4" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          ) : (
            <div className="bg-black border border-metal-gold/20 rounded-lg p-12 text-center">
              <i className="fas fa-calendar-alt text-4xl text-metal-gold mb-6"></i>
              <h3 className="text-3xl font-metal text-metal-gold mb-4">TO BE ANNOUNCED</h3>
              <p className="text-gray-300 text-lg mb-6">
                New performance dates are being scheduled. Stay tuned for announcements!
              </p>
              <div className="text-sm text-gray-400">
                Follow us on social media for the latest updates on upcoming shows
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
