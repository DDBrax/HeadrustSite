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
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">TOUR DATES</h2>
          <div className="text-center text-red-500">
            <p>Failed to load tour dates. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tours" className="section-padding metal-gradient">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">TOUR DATES</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-black border border-metal-gold/20 rounded-lg overflow-hidden">
            <div className="bg-metal-gold text-black p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-bold">
                <div>DATE</div>
                <div>CITY</div>
                <div>VENUE</div>
                <div>TICKETS</div>
              </div>
            </div>
            
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="border-b border-metal-gold/10 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-8 w-full md:w-24" />
                  </div>
                </div>
              ))
            ) : (
              tourDates?.map((show, index) => (
                <div 
                  key={show.id} 
                  className={`hover:bg-dark-gray transition-colors duration-300 ${
                    index < tourDates.length - 1 ? 'border-b border-metal-gold/10' : ''
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 items-center">
                    <div className="text-metal-gold font-semibold">{show.date}</div>
                    <div className="text-white">{show.city}</div>
                    <div className="text-gray-300">{show.venue}</div>
                    <button 
                      className="bg-blood-red hover:bg-red-700 text-white px-4 py-2 text-sm font-bold transition-colors duration-300 w-full md:w-auto"
                      disabled={!show.ticketsAvailable}
                    >
                      {show.ticketsAvailable ? 'BUY NOW' : 'SOLD OUT'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
