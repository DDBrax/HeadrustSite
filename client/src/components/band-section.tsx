import { useQuery } from "@tanstack/react-query";
import type { BandMember } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BandSection() {
  const { data: bandMembers, isLoading, error } = useQuery<BandMember[]>({
    queryKey: ['/api/band-members']
  });

  if (error) {
    return (
      <section id="band" className="section-padding metal-gradient">
        <div className="container-padding">
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">THE BAND</h2>
          <div className="text-center text-red-500">
            <p>Failed to load band members. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="band" className="section-padding metal-gradient">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-12">THE BAND</h2>
        
        {/* Band Bio */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <p className="text-lg text-gray-300 leading-relaxed">
            Headrust was formed in 2005 by drummer George Samaniego and guitarist Steve Urquides, lifelong friends bonded by their passion for heavy music. After early lineup changes, the band found new life in 2006 with vocalist Dennis Brack, whose powerful voice and energy gave Headrust a fresh edge. In 2008, bassist Frankie Verdugo joined, bringing unmatched stage presence and songwriting skills. Together, they forged Headrust's signature sound—heavy rhythms, dynamic melodies, and raw emotion—building a reputation as a relentless force in heavy music.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="group relative overflow-hidden bg-dark-gray border border-metal-gold/20">
                <Skeleton className="w-full aspect-square" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            bandMembers?.map((member, index) => (
              <Card 
                key={member.id} 
                className="group relative overflow-hidden bg-dark-gray border border-metal-gold/20 hover:border-metal-gold transition-all duration-500 transform hover:scale-105"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-900">
                  <img 
                    src={member.imageUrl} 
                    alt={`${member.name} - ${member.role}`} 
                    className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ${
                      index === 0 ? 'object-[center_40%]' : index === 1 ? 'object-[center_20%]' : 'object-top'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-metal text-metal-gold mb-2">{member.name}</h3>
                  <p className="text-gray-400 font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-gray-300">{member.bio}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
