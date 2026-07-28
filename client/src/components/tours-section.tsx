import summerThunderFlyer from "@assets/summer-thunder-2026-flyer.jpg";
import callingForChaosFlyer from "@assets/calling-for-chaos-september-2026-flyer.jpg";

const performanceDates = [
  {
    date: "SATURDAY, AUGUST 15, 2026",
    title: "SUMMER THUNDER 2026",
    venue: "Tones N Bones",
    address: "6640 W Cactus Rd Unit 116/117, Glendale, AZ 85304",
    time: "Event 9:00 AM–10:00 PM • Cash door 10:00 AM • Music 10:30 AM",
    admission: "All ages • Adults $15 • Under 18 $10 • Ages 12 & under free",
    summary: "A 14-band, all-day festival featuring Headrust, food, and family-friendly fun.",
    flyer: summerThunderFlyer,
    flyerAlt: "Summer Thunder 2026 full event flyer",
    eventUrl: "https://www.facebook.com/events/1051663130765535/",
  },
  {
    date: "SATURDAY, SEPTEMBER 5, 2026",
    title: "CALLING FOR CHAOS + BURY THE FEAR + INVICTUS",
    venue: "The Rock",
    address: "136 N Park Ave, Tucson, AZ 85719",
    time: "Doors 7:00 PM • Event 7:00–11:55 PM",
    admission: "21+ with ID • Online tickets from $15 before fees",
    summary: "With special guests Headrust and Hell Doubt.",
    flyer: callingForChaosFlyer,
    flyerAlt: "Calling for Chaos, Bury the Fear, Invictus, Headrust, and Hell Doubt event flyer",
    eventUrl: "https://www.facebook.com/events/1017411584023173/",
    ticketUrl: "https://www.eventbrite.com/e/calling-for-chaos-with-bury-the-fear-tickets-1992719566867",
  },
];

export default function ToursSection() {
  return (
    <section id="tours" className="section-padding metal-gradient">
      <div className="container-padding">
        <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">
          PERFORMANCE DATES
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {performanceDates.map((performance) => (
            <article
              key={performance.eventUrl}
              className="overflow-hidden rounded-lg border border-metal-gold/20 bg-black shadow-xl"
            >
              <a
                href={performance.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-black"
                aria-label={`View ${performance.title} details on Facebook`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-black">
                  <img
                    src={performance.flyer}
                    alt={performance.flyerAlt}
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              </a>

              <div className="p-6 md:p-8">
                <p className="text-sm font-bold tracking-[0.14em] text-metal-gold">
                  {performance.date}
                </p>
                <h3 className="mt-3 text-2xl font-metal text-white">
                  {performance.title}
                </h3>
                <p className="mt-3 text-lg font-semibold text-metal-gold">
                  {performance.venue}
                </p>
                <p className="text-sm text-gray-300">{performance.address}</p>

                <div className="mt-5 space-y-2 text-sm text-gray-300">
                  <p>
                    <i className="fas fa-clock mr-2 text-metal-gold" aria-hidden="true"></i>
                    {performance.time}
                  </p>
                  <p>
                    <i className="fas fa-ticket-alt mr-2 text-metal-gold" aria-hidden="true"></i>
                    {performance.admission}
                  </p>
                </div>

                <p className="mt-5 text-gray-300">{performance.summary}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={performance.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-metal-gold px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-metal-gold/80"
                  >
                    Facebook Event
                    <i className="fas fa-external-link-alt ml-2 text-xs" aria-hidden="true"></i>
                  </a>
                  {performance.ticketUrl && (
                    <a
                      href={performance.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md border border-metal-gold px-4 py-2 text-sm font-bold text-metal-gold transition-colors hover:bg-metal-gold/10"
                    >
                      Buy Tickets
                      <i className="fas fa-external-link-alt ml-2 text-xs" aria-hidden="true"></i>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
