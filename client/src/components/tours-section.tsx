import summerThunderFlyer from "@assets/summer-thunder-2026-flyer.jpg";
import callingForChaosFlyer from "@assets/calling-for-chaos-september-2026-flyer.jpg";

const summerThunderSetTimes = [
  { artist: "Smoke Means Fire", time: "9:30–9:55 AM" },
  { artist: "Strychnine", time: "10:10–10:35 AM" },
  { artist: "Escaping Hollows", time: "10:50–11:15 AM" },
  { artist: "Raven's Rose", time: "11:30–11:55 AM" },
  { artist: "Sol Of X", time: "12:15–12:45 PM" },
  { artist: "Redrumed", time: "1:05–1:35 PM" },
  { artist: "Headrust", time: "1:55–2:25 PM", featured: true },
  { artist: "Rammkeine", time: "2:45–3:30 PM" },
  { artist: "Lisa Mitts", time: "3:50–4:35 PM" },
  { artist: "P-R Family", time: "4:55–5:40 PM" },
  { artist: "Lost Angel", time: "6:00–6:45 PM" },
  { artist: "Magnum Axxe", time: "7:05–7:50 PM" },
  { artist: "2 in the Chest", time: "8:10–8:55 PM" },
  { artist: "Dawn of the Rising", time: "9:15–10:00 PM" },
];

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
    doorTime: "9:00 AM",
    setTimes: summerThunderSetTimes,
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

        <div className="mx-auto max-w-6xl space-y-8">
          {performanceDates.map((performance) => (
            <article
              key={performance.eventUrl}
              className={
                performance.setTimes
                  ? "grid grid-cols-1 overflow-hidden rounded-lg border-0 bg-black shadow-xl lg:grid-cols-2"
                  : "grid grid-cols-1 overflow-hidden rounded-lg border border-metal-gold/20 bg-black shadow-xl lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
              }
            >
              <a
                href={performance.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  performance.setTimes
                    ? "flex items-start justify-center bg-black p-4 md:p-6 lg:p-8"
                    : "block bg-black lg:h-full"
                }
                aria-label={`View ${performance.title} details on Facebook`}
              >
                <div
                  className={
                    performance.setTimes
                      ? "w-full max-w-[30rem] overflow-hidden bg-black"
                      : "aspect-[4/5] overflow-hidden bg-black lg:h-full lg:aspect-auto"
                  }
                >
                  <img
                    src={performance.flyer}
                    alt={performance.flyerAlt}
                    className={
                      performance.setTimes
                        ? "h-auto w-full scale-[1.015] object-contain transition-transform duration-300 hover:scale-[1.03]"
                        : "h-full w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
                    }
                  />
                </div>
              </a>

              <div className="flex min-w-0 flex-col p-6 md:p-8 lg:p-10">
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

                {performance.setTimes && (
                  <section
                    className="mt-6 overflow-hidden rounded-lg border border-metal-gold/30 bg-zinc-950"
                    aria-labelledby="summer-thunder-set-times"
                  >
                    <div className="flex flex-col gap-2 border-b border-metal-gold/20 bg-metal-gold/10 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                          Summer Thunder
                        </p>
                        <h4
                          id="summer-thunder-set-times"
                          className="mt-1 text-xl font-metal text-metal-gold"
                        >
                          SET TIMES
                        </h4>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        Doors open {performance.doorTime}
                      </p>
                    </div>

                    <ol className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                      {performance.setTimes.map((set) => (
                        <li
                          key={set.artist}
                          className={
                            set.featured
                              ? "flex items-center justify-between gap-3 rounded-md border border-metal-gold bg-metal-gold/15 px-3 py-2 text-sm shadow-[0_0_18px_rgba(212,175,55,0.12)]"
                              : "flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm"
                          }
                        >
                          <span
                            className={
                              set.featured
                                ? "font-bold uppercase tracking-wide text-metal-gold"
                                : "font-semibold text-white"
                            }
                          >
                            {set.artist}
                          </span>
                          <time className="shrink-0 text-right text-gray-300">
                            {set.time}
                          </time>
                        </li>
                      ))}
                    </ol>
                    <p className="border-t border-white/10 px-4 py-3 text-xs text-gray-400">
                      Schedule is subject to change. All times are Arizona time.
                    </p>
                  </section>
                )}

                <div className="mt-6 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
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
