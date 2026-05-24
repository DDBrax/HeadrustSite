import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { calculateShipping, getShippingCostWithFreeShipping, US_STATES, FREE_SHIPPING_THRESHOLD, formatCurrency } from "@shared/shipping";
import { findZipByCity, lookupLocationByZip } from "@shared/cityZipLookup";

const customOrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  shirtQuantity: z.number().min(0).max(20, "Maximum 20 items allowed"),
  shirtSizes: z.array(z.string()).optional(),
  hatQuantity: z.number().min(0).max(20, "Maximum 20 items allowed"),
  albumQuantity: z.number().min(0).max(20, "Maximum 20 items allowed"),
  albumColors: z.array(z.string()).optional(),
  shippingCity: z.string().min(1, "City is required for shipping"),
  shippingState: z.string().min(1, "State is required for shipping"),
  shippingZip: z.string().min(5, "Valid ZIP code is required"),
});

type CustomOrderForm = z.infer<typeof customOrderSchema>;

interface CustomOrderFormProps {
  children: React.ReactNode;
  initialItem?: 'shirt' | 'hat' | 'album';
}

export default function CustomOrderForm({ children, initialItem }: CustomOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shirtSizes, setShirtSizes] = useState<string[]>([]);
  const [albumColors, setAlbumColors] = useState<string[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingLabel, setShippingLabel] = useState("$0.00");
  const [subtotal, setSubtotal] = useState(0);
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);
  const [locationData, setLocationData] = useState<{lat?: number; lng?: number}>({});

  const form = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      shirtQuantity: initialItem === 'shirt' ? 1 : 0,
      shirtSizes: initialItem === 'shirt' ? [''] : [],
      hatQuantity: initialItem === 'hat' ? 1 : 0,
      albumQuantity: initialItem === 'album' ? 1 : 0,
      albumColors: initialItem === 'album' ? [''] : [],
      shippingCity: "",
      shippingState: "",
      shippingZip: "",
    },
  });

  const submitOrderMutation = useMutation({
    mutationFn: async (data: CustomOrderForm) => {
      const response = await apiRequest("POST", "/api/custom-order", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Submitted",
        description: data?.emailSent
          ? "Your custom order has been emailed. We'll contact you soon!"
          : "Your custom order was received, but the email notification needs attention.",
      });
      form.reset();
      setShirtSizes([]); // Reset shirt sizes state
      setAlbumColors([]); // Reset album colors state
      setShippingCost(0);
      setShippingLabel("$0.00");
      setSubtotal(0);
      setLocationData({});
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/custom-orders"] });
    },
    onError: (error) => {
      console.error("Order submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomOrderForm) => {
    // Validate that at least one item is being ordered
    if (data.shirtQuantity === 0 && data.hatQuantity === 0 && data.albumQuantity === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to order.",
        variant: "destructive",
      });
      return;
    }

    // If shirts are selected, validate that all sizes are selected
    if (data.shirtQuantity > 0) {
      const validSizes = data.shirtSizes?.filter(size => size && size.trim() !== "") || [];
      if (validSizes.length !== data.shirtQuantity) {
        toast({
          title: "Shirt Sizes Required",
          description: `Please select ${data.shirtQuantity} shirt size${data.shirtQuantity > 1 ? 's' : ''}.`,
          variant: "destructive",
        });
        return;
      }
      // Update the data to only include valid sizes
      data.shirtSizes = validSizes;
    }

    // If albums are selected, validate that all colors are selected
    if (data.albumQuantity > 0) {
      const validColors = data.albumColors?.filter(color => color && color.trim() !== "") || [];
      if (validColors.length !== data.albumQuantity) {
        toast({
          title: "Album Colors Required",
          description: `Please select ${data.albumQuantity} album color${data.albumQuantity > 1 ? 's' : ''}.`,
          variant: "destructive",
        });
        return;
      }
      // Update the data to only include valid colors
      data.albumColors = validColors;
    }

    // Calculate shipping
    const shippingCalc = calculateShipping(
      data.shirtQuantity,
      data.hatQuantity,
      data.albumQuantity,
      data.shippingState
    );
    
    const finalShipping = getShippingCostWithFreeShipping(subtotal, shippingCalc);

    // Submit the order with shipping info
    const orderData = {
      ...data,
      shippingCost: finalShipping.formattedCost,
      subtotal: formatCurrency(subtotal),
      albumColors: data.albumColors || [],
    };

    submitOrderMutation.mutate(orderData);
  };

  // Watch shirt quantity to update sizes array
  const shirtQuantity = form.watch("shirtQuantity");
  const albumQuantity = form.watch("albumQuantity");
  
  useEffect(() => {
    if (shirtQuantity >= 0) {
      const newSizes = Array(Math.max(0, shirtQuantity)).fill("");
      setShirtSizes(newSizes);
      // Don't set form value to empty array when quantity is 0
      if (shirtQuantity > 0) {
        form.setValue("shirtSizes", newSizes);
      } else {
        form.setValue("shirtSizes", []);
      }
    }
  }, [shirtQuantity, form]);

  // Watch album quantity to update colors array
  useEffect(() => {
    if (albumQuantity >= 0) {
      const newColors = Array(Math.max(0, albumQuantity)).fill("");
      setAlbumColors(newColors);
      // Don't set form value to empty array when quantity is 0
      if (albumQuantity > 0) {
        form.setValue("albumColors", newColors);
      } else {
        form.setValue("albumColors", []);
      }
    }
  }, [albumQuantity, form]);

  const updateShirtSize = (index: number, size: string) => {
    const updatedSizes = [...shirtSizes];
    updatedSizes[index] = size;
    setShirtSizes(updatedSizes);
    // Keep the array structure intact, don't filter empty strings
    form.setValue("shirtSizes", updatedSizes);
  };

  const updateAlbumColor = (index: number, color: string) => {
    const updatedColors = [...albumColors];
    updatedColors[index] = color;
    setAlbumColors(updatedColors);
    // Keep the array structure intact, don't filter empty strings
    form.setValue("albumColors", updatedColors);
  };

  const calculateTotal = () => {
    const shirtPrice = 25;
    const hatPrice = 30;
    const albumPrice = 35;
    
    return (
      form.watch("shirtQuantity") * shirtPrice +
      form.watch("hatQuantity") * hatPrice +
      form.watch("albumQuantity") * albumPrice
    );
  };

  // Watch for changes to calculate shipping and subtotal
  const watchedValues = form.watch(["shirtQuantity", "hatQuantity", "albumQuantity", "shippingState", "shippingCity"]);
  
  useEffect(() => {
    const [shirtQty, hatQty, albumQty, state, city] = watchedValues;
    const newSubtotal = calculateTotal();
    setSubtotal(newSubtotal);
    
    if (state && (shirtQty > 0 || hatQty > 0 || albumQty > 0)) {
      const shippingCalc = calculateShipping(shirtQty, hatQty, albumQty, state);
      const finalShipping = getShippingCostWithFreeShipping(
        newSubtotal, 
        shippingCalc, 
        city, 
        form.watch("shippingZip"),
        locationData.lat,
        locationData.lng
      );
      setShippingCost(finalShipping.shippingCost);
      setShippingLabel(finalShipping.formattedCost);
    } else {
      setShippingCost(0);
      setShippingLabel("$0.00");
    }
  }, [watchedValues]);

  // Auto-lookup city and state when ZIP code is entered
  const handleZipBlur = async () => {
    const zip = form.getValues("shippingZip");
    
    if (zip && zip.length === 5) {
      setIsLookingUpZip(true);
      
      try {
        const locationInfo = await lookupLocationByZip(zip);
        if (locationInfo) {
          form.setValue("shippingCity", locationInfo.city);
          form.setValue("shippingState", locationInfo.state);
          
          // Store coordinates for distance calculation
          if (locationInfo.latitude && locationInfo.longitude) {
            setLocationData({
              lat: locationInfo.latitude,
              lng: locationInfo.longitude
            });
          }
        }
      } catch (error) {
        console.warn('City/State lookup failed:', error);
      } finally {
        setIsLookingUpZip(false);
      }
    }
  };

  // Auto-fill quantity to 1 when item is clicked
  const handleItemClick = (itemType: 'shirt' | 'hat' | 'album') => {
    const currentQuantity = form.getValues(`${itemType}Quantity` as keyof CustomOrderForm) as number;
    if (currentQuantity === 0) {
      form.setValue(`${itemType}Quantity` as keyof CustomOrderForm, 1 as any);
    }
  };

  // Reset form and state when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setShirtSizes([]);
      setAlbumColors([]);
    } else if (open && initialItem) {
      // Set initial quantities when opening with a specific item
      if (initialItem === 'shirt') {
        form.setValue('shirtQuantity', 1);
        setShirtSizes(['']);
      } else if (initialItem === 'hat') {
        form.setValue('hatQuantity', 1);
      } else if (initialItem === 'album') {
        form.setValue('albumQuantity', 1);
        setAlbumColors(['']);
      }
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-dark-gray border border-metal-gold/20 text-white max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="relative">
          <DialogTitle className="text-metal-gold text-xl pr-8">
            Custom Order Request
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
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type === 'number') {
            e.preventDefault();
            // Move focus to next input field
            const inputs = Array.from(document.querySelectorAll('input[type="number"]')) as HTMLInputElement[];
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
              inputs[currentIndex + 1].focus();
            }
          } else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
            e.preventDefault();
          }
        }}>
          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-metal-gold">Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              className="bg-medium-gray border-metal-gold/30 text-white"
              placeholder="Your full name"
            />
            {form.formState.errors.name && (
              <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-metal-gold">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className="bg-medium-gray border-metal-gold/30 text-white"
              placeholder="your.email@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* T-Shirt Selection */}
          <div className="border-t border-metal-gold/20 pt-4">
            <div 
              className="cursor-pointer hover:bg-metal-gold/5 p-2 rounded-lg transition-colors"
              onClick={() => handleItemClick('shirt')}
            >
              <h3 className="text-metal-gold font-semibold mb-3">Eyes on Empire T-Shirt ($25.00)</h3>
              <p className="text-xs text-gray-400 mb-3">Click to add • Max: 20 items</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="shirtQuantity" className="text-sm">Quantity</Label>
                <Input
                  id="shirtQuantity"
                  type="number"
                  min="0"
                  max="20"
                  {...form.register("shirtQuantity", { valueAsNumber: true })}
                  className="bg-medium-gray border-metal-gold/30 text-white"
                />
                {form.formState.errors.shirtQuantity && (
                  <p className="text-red-400 text-xs">{form.formState.errors.shirtQuantity.message}</p>
                )}
              </div>
              {shirtQuantity > 0 && (
                <div className="col-span-2 space-y-3">
                  <Label className="text-sm font-medium text-metal-gold">
                    Sizes for {shirtQuantity} shirt{shirtQuantity > 1 ? 's' : ''}:
                  </Label>
                  <div className="space-y-2">
                    {Array.from({ length: shirtQuantity }, (_, index) => (
                      <div key={`${shirtQuantity}-${index}`} className="flex items-center gap-2">
                        <Label className="text-xs text-gray-300 min-w-[50px]">
                          Shirt {index + 1}:
                        </Label>
                        <Select 
                          key={`select-${shirtQuantity}-${index}`}
                          onValueChange={(value) => updateShirtSize(index, value)}
                          value={shirtSizes[index] || ""}
                        >
                          <SelectTrigger className="bg-medium-gray border-metal-gold/30 text-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S">Small</SelectItem>
                            <SelectItem value="M">Medium</SelectItem>
                            <SelectItem value="L">Large</SelectItem>
                            <SelectItem value="XL">X-Large</SelectItem>
                            <SelectItem value="XXL">XX-Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hat Selection */}
          <div className="border-t border-metal-gold/20 pt-4">
            <div 
              className="cursor-pointer hover:bg-metal-gold/5 p-2 rounded-lg transition-colors"
              onClick={() => handleItemClick('hat')}
            >
              <h3 className="text-metal-gold font-semibold mb-3">Headrust Trucker Hat ($30.00)</h3>
              <p className="text-xs text-gray-400 mb-3">Click to add • Max: 20 items</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hatQuantity" className="text-sm">Quantity</Label>
              <Input
                id="hatQuantity"
                type="number"
                min="0"
                max="20"
                {...form.register("hatQuantity", { valueAsNumber: true })}
                className="bg-medium-gray border-metal-gold/30 text-white"
              />
              {form.formState.errors.hatQuantity && (
                <p className="text-red-400 text-xs">{form.formState.errors.hatQuantity.message}</p>
              )}
            </div>
          </div>

          {/* Album Selection */}
          <div className="border-t border-metal-gold/20 pt-4">
            <div 
              className="cursor-pointer hover:bg-metal-gold/5 p-2 rounded-lg transition-colors"
              onClick={() => handleItemClick('album')}
            >
              <h3 className="text-metal-gold font-semibold mb-3">Limited Edition 12" Record ($35.00)</h3>
              <p className="text-xs text-gray-400 mb-3">Click to add • Max: 20 items</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="albumQuantity" className="text-sm">Quantity</Label>
                <Input
                  id="albumQuantity"
                  type="number"
                  min="0"
                  max="20"
                  {...form.register("albumQuantity", { valueAsNumber: true })}
                  className="bg-medium-gray border-metal-gold/30 text-white"
                />
                {form.formState.errors.albumQuantity && (
                  <p className="text-red-400 text-xs">{form.formState.errors.albumQuantity.message}</p>
                )}
              </div>
              {albumQuantity > 0 && (
                <div className="col-span-2 space-y-3">
                  <Label className="text-sm font-medium text-metal-gold">
                    Colors for {albumQuantity} album{albumQuantity > 1 ? 's' : ''}:
                  </Label>
                  <div className="space-y-2">
                    {Array.from({ length: albumQuantity }, (_, index) => (
                      <div key={`${albumQuantity}-${index}`} className="flex items-center gap-2">
                        <Label className="text-xs text-gray-300 min-w-[50px]">
                          Album {index + 1}:
                        </Label>
                        <Select 
                          key={`select-${albumQuantity}-${index}`}
                          onValueChange={(value) => updateAlbumColor(index, value)}
                          value={albumColors[index] || ""}
                        >
                          <SelectTrigger className="bg-medium-gray border-metal-gold/30 text-white">
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="black">Black Vinyl</SelectItem>
                            <SelectItem value="clear">Clear Vinyl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border-t border-metal-gold/20 pt-4">
            <h3 className="text-metal-gold font-semibold mb-3">Shipping Information</h3>
            <p className="text-xs text-gray-400 mb-3">Continental US shipping only. Free shipping on orders $100+</p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="shippingZip" className="text-sm">
                  ZIP Code * {isLookingUpZip && <span className="text-xs text-yellow-400">(looking up...)</span>}
                </Label>
                <Input
                  id="shippingZip"
                  {...form.register("shippingZip")}
                  className="bg-medium-gray border-metal-gold/30 text-white"
                  placeholder="Enter your ZIP code"
                  maxLength={5}
                  onBlur={handleZipBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleZipBlur();
                    }
                  }}
                />
                {form.formState.errors.shippingZip && (
                  <p className="text-red-400 text-sm">{form.formState.errors.shippingZip.message}</p>
                )}
                <p className="text-xs text-gray-400">City and state will auto-fill from your ZIP code</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="shippingCity" className="text-sm">City *</Label>
                  <Input
                    id="shippingCity"
                    {...form.register("shippingCity")}
                    className="bg-medium-gray border-metal-gold/30 text-white"
                    placeholder="Auto-filled from ZIP"
                    readOnly
                  />
                  {form.formState.errors.shippingCity && (
                    <p className="text-red-400 text-sm">{form.formState.errors.shippingCity.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingState" className="text-sm">State *</Label>
                  <Input
                    id="shippingState"
                    {...form.register("shippingState")}
                    className="bg-medium-gray border-metal-gold/30 text-white"
                    placeholder="Auto-filled from ZIP"
                    readOnly
                  />
                  {form.formState.errors.shippingState && (
                    <p className="text-red-400 text-sm">{form.formState.errors.shippingState.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-metal-gold/20 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Subtotal:</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Shipping:</span>
                <span className="text-white">
                  {subtotal > 0 && form.watch("shippingState") ? shippingLabel : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold border-t border-metal-gold/20 pt-2">
                <span className="text-metal-gold">Total:</span>
                <span className="text-white">
                  ${(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : shippingCost)).toFixed(2)}
                </span>
              </div>
              {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-yellow-400">
                  Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              {subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                <p className="text-xs text-green-400">
                  🎉 You qualify for free shipping!
                </p>
              )}
            </div>
          </div>

          {/* Payment Instructions */}
          {subtotal > 0 && (
            <div className="bg-metal-gold/10 border border-metal-gold/30 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <i className="fas fa-info-circle text-metal-gold mt-0.5 text-sm"></i>
                <div className="text-sm">
                  <p className="text-metal-gold font-semibold mb-1">Payment Instructions</p>
                  <p className="text-gray-300 mb-2">
                    After submitting your order, we will contact you with payment options and instructions.
                  </p>
                  <p className="text-gray-400 text-xs">
                    Accepted payment methods: <span className="text-metal-gold font-medium">Zelle • Venmo • PayPal</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitOrderMutation.isPending}
            className="w-full bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold"
          >
            {submitOrderMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Submit Order Request
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
