import { useState, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Merchandise } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import CustomOrderForm from "@/components/custom-order-form";
import SimpleCustomForm from "@/components/simple-custom-form";

const isSnapbackHat = (name: string) => name.includes("Snapback Hat");
const isFeaturedTShirt = (name: string) =>
  name === "Eyes on Empire T-Shirt" ||
  name === "Vultures' Last Encore T-Shirt" ||
  name === "Serpent Double Kick T-Shirt";

export default function MerchandiseSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<Merchandise | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const { data: merchandise, isLoading, error } = useQuery<Merchandise[]>({
    queryKey: ['/api/merchandise']
  });

  const categories = ["all", "apparel", "vinyl"];
  
  const filteredMerchandise = merchandise
    ?.filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .sort((a, b) => Number(isFeaturedTShirt(b.name)) - Number(isFeaturedTShirt(a.name)));

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const openItemDetails = (item: Merchandise) => {
    setSelectedItem(item);
    setOpenItemId(item.id);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: Merchandise) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openItemDetails(item);
    }
  };

  if (error) {
    return (
      <section id="merchandise" className="section-padding bg-black">
        <div className="container-padding">
          <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">MERCHANDISE</h2>
          <div className="text-center text-red-500">
            <p>Failed to load merchandise. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="merchandise" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-3xl md:text-5xl font-metal text-center text-metal-gold mb-8 md:mb-16">MERCHANDISE</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-metal-gold text-black hover:bg-metal-gold/80'
                  : 'border-metal-gold/50 text-metal-gold hover:bg-metal-gold/10'
              }`}
            >
              {formatCategory(category)}
            </Button>
          ))}
        </div>

        {/* Merchandise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-dark-gray border border-metal-gold/20">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-64 rounded-t-lg" />
                  <div className="p-4 md:p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredMerchandise && filteredMerchandise.length > 0 ? (
            filteredMerchandise.map((item) => (
              <Card 
                key={item.id} 
                role="button"
                tabIndex={0}
                aria-label={`View details for ${item.name}`}
                onClick={(event) => {
                  if (event.target instanceof HTMLElement && event.target.closest('[role="dialog"]')) return;
                  openItemDetails(item);
                }}
                onKeyDown={(event) => handleCardKeyDown(event, item)}
                className="h-full bg-dark-gray border border-metal-gold/20 hover:border-metal-gold focus-visible:border-metal-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-metal-gold/70 transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="h-full p-0 flex flex-col">
                  <div
                    className={`relative overflow-hidden rounded-t-lg ${
                      isFeaturedTShirt(item.name) || item.category === "vinyl"
                        ? "aspect-square bg-black"
                        : isSnapbackHat(item.name)
                          ? "aspect-[4/3] bg-black"
                          : ""
                    }`}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className={
                        item.category === "vinyl"
                          ? "w-full h-full object-contain bg-black p-5 md:p-6 transform-gpu [backface-visibility:hidden] group-hover:scale-[1.02] transition-transform duration-300"
                          : isSnapbackHat(item.name)
                          ? "w-full h-full object-contain transform-gpu [backface-visibility:hidden]"
                          : isFeaturedTShirt(item.name)
                            ? "w-full h-full object-contain transform-gpu [backface-visibility:hidden] group-hover:scale-[1.02] transition-transform duration-300"
                          : "w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      }
                    />
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-metal-gold/90 text-black font-semibold"
                      >
                        {formatCategory(item.category)}
                      </Badge>
                    </div>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 md:p-6 flex flex-1 flex-col">
                    <h3 className="text-lg md:text-xl font-sans font-medium tracking-wide text-white mb-2 group-hover:text-metal-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl md:text-2xl font-bold text-metal-gold">
                        {item.price}
                      </span>
                      
                      <Dialog
                        open={openItemId === item.id}
                        onOpenChange={(open) => {
                          if (open) {
                            openItemDetails(item);
                          } else {
                            setOpenItemId(null);
                          }
                        }}
                      >
                        <span className="inline-flex h-9 items-center justify-center rounded-md bg-metal-gold px-3 text-sm font-semibold text-black group-hover:bg-metal-gold/80">
                          View Details
                        </span>
                        <DialogContent
                          className={`bg-dark-gray border border-metal-gold/20 text-white max-h-[90vh] overflow-y-auto [&>button]:hidden ${
                            selectedItem && isFeaturedTShirt(selectedItem.name)
                              ? "max-w-[min(96vw,72rem)]"
                              : "max-w-2xl"
                          }`}
                        >
                          <DialogHeader className="relative">
                            <DialogTitle className="text-metal-gold text-xl md:text-2xl pr-8">
                              {selectedItem?.name}
                            </DialogTitle>
                            <DialogClose asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-6 w-6 p-0 text-metal-gold hover:text-white hover:bg-metal-gold/20"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                              </Button>
                            </DialogClose>
                          </DialogHeader>
                          
                          {selectedItem && (
                            <div
                              className={
                                isFeaturedTShirt(selectedItem.name)
                                  ? "grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] gap-6"
                                  : "grid grid-cols-1 md:grid-cols-2 gap-6"
                              }
                            >
                              <div>
                                <img
                                  src={selectedItem.imageUrl}
                                  alt={selectedItem.name}
                                  className={
                                    selectedItem.category === "vinyl"
                                      ? "w-full aspect-square object-contain bg-black p-6 rounded-lg transform-gpu [backface-visibility:hidden]"
                                      : isSnapbackHat(selectedItem.name)
                                      ? "w-full aspect-square object-contain bg-black rounded-lg transform-gpu [backface-visibility:hidden]"
                                      : isFeaturedTShirt(selectedItem.name)
                                        ? "w-full h-auto object-contain bg-black rounded-lg transform-gpu [backface-visibility:hidden]"
                                      : "w-full h-64 md:h-80 object-cover rounded-lg"
                                  }
                                />
                              </div>
                              
                              <div className="space-y-4">
                                <Badge 
                                  variant="secondary" 
                                  className="bg-metal-gold/20 text-metal-gold"
                                >
                                  {formatCategory(selectedItem.category)}
                                </Badge>
                                
                                <p className="text-gray-300 leading-relaxed">
                                  {selectedItem.description}
                                </p>
                                
                                <div className="flex items-center justify-between pt-4">
                                  <span className="text-2xl md:text-3xl font-bold text-metal-gold">
                                    {selectedItem.price}
                                  </span>
                                  
                                  {selectedItem.inStock ? (
                                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                                      In Stock
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">
                                      Out of Stock
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="pt-4">
                                  {selectedItem.purchaseUrl ? (
                                    <Button 
                                      asChild
                                      className="w-full bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold"
                                      disabled={!selectedItem.inStock}
                                    >
                                      <a 
                                        href={selectedItem.purchaseUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                      >
                                        <i className="fas fa-shopping-cart mr-2"></i>
                                        Buy Now
                                      </a>
                                    </Button>
                                  ) : (
                                    <CustomOrderForm 
                                      initialItem={
                                        selectedItem.name === "Vultures' Last Encore T-Shirt" ? 'vultureShirt' :
                                        selectedItem.name === 'Serpent Double Kick T-Shirt' ? 'serpentShirt' :
                                        selectedItem.name.includes('T-Shirt') || selectedItem.name.includes('Shirt') ? 'shirt' :
                                        selectedItem.name.includes('HR Logo Snapback') ? 'hrLogoHat' :
                                        selectedItem.name.includes('Headrust Logo Snapback') ? 'headrustLogoHat' :
                                        selectedItem.name.includes('Record') || selectedItem.name.includes('Vinyl') || selectedItem.name.includes('Album') ? 'album' :
                                        undefined
                                      }
                                    >
                                      <Button className="w-full bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold">
                                        <i className="fas fa-envelope mr-2"></i>
                                        Request Order
                                      </Button>
                                    </CustomOrderForm>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-box-open text-4xl text-metal-gold/50 mb-4"></i>
              <h3 className="text-xl text-metal-gold mb-2">No items found</h3>
              <p className="text-gray-400">
                {selectedCategory === "all" 
                  ? "No merchandise available at the moment" 
                  : `No ${selectedCategory} items available`}
              </p>
            </div>
          )}
        </div>

        {/* Support Headrust Section */}
        {filteredMerchandise && filteredMerchandise.length > 0 && (
          <div className="mt-12 md:mt-16 max-w-md mx-auto">
            <SimpleCustomForm />
          </div>
        )}
      </div>
    </section>
  );
}
