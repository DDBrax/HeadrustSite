import { useQuery } from "@tanstack/react-query";
import type { NewsArticle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsSection() {
  const { data: newsArticles, isLoading, error } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news']
  });

  if (error) {
    return (
      <section id="news" className="section-padding metal-gradient">
        <div className="container-padding">
          <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">LATEST NEWS</h2>
          <div className="text-center text-red-500">
            <p>Failed to load news articles. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="section-padding metal-gradient">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-16">LATEST NEWS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-black border border-metal-gold/20">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            newsArticles?.map((article) => (
              <Card 
                key={article.id} 
                className="bg-black border border-metal-gold/20 hover:border-metal-gold transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-metal-gold text-sm font-semibold mb-2">
                    {article.date}
                  </div>
                  <h3 className="text-xl font-metal text-white mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <button className="text-metal-gold hover:text-yellow-400 font-semibold text-sm transition-colors duration-300">
                    READ MORE <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
