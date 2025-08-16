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
import { findZipByCity } from "@shared/cityZipLookup";

const customOrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  shirtQuantity: z.number().min(0),
  shirtSizes: z.array(z.string()).optional(),
  hatQuantity: z.number().min(0),
  albumQuantity: z.number().min(0),
  shippingCity: z.string().min(1, "City is required for shipping"),
  shippingState: z.string().min(1, "State is required for shipping"),
  shippingZip: z.string().min(5, "Valid ZIP code is required"),
});

type CustomOrderForm = z.infer<typeof customOrderSchema>;

interface CustomOrderFormProps {
  children: React.ReactNode;
}

export default function CustomOrderForm({ children }: CustomOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shirtSizes, setShirtSizes] = useState<string[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);

  const form = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      shirtQuantity: 0,
      shirtSizes: [],
      hatQuantity: 0,
      albumQuantity: 0,
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
    onSuccess: () => {
      toast({
        title: "Order Submitted",
        description: "Your custom order has been sent. We'll contact you soon!",
      });
      form.reset();
      setShirtSizes([]); // Reset shirt sizes state
      setShippingCost(0);
      setSubtotal(0);
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
    };

    submitOrderMutation.mutate(orderData);
  };

  // Watch shirt quantity to update sizes array
  const shirtQuantity = form.watch("shirtQuantity");
  
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

  const updateShirtSize = (index: number, size: string) => {
    const updatedSizes = [...shirtSizes];
    updatedSizes[index] = size;
    setShirtSizes(updatedSizes);
    // Keep the array structure intact, don't filter empty strings
    form.setValue("shirtSizes", updatedSizes);
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
  const quantities = form.watch(["shirtQuantity", "hatQuantity", "albumQuantity", "shippingState"]);
  
  useEffect(() => {
    const [shirtQty, hatQty, albumQty, state] = quantities;
    const newSubtotal = calculateTotal();
    setSubtotal(newSubtotal);
    
    if (state && (shirtQty > 0 || hatQty > 0 || albumQty > 0)) {
      const shippingCalc = calculateShipping(shirtQty, hatQty, albumQty, state);
      const finalShipping = getShippingCostWithFreeShipping(newSubtotal, shippingCalc);
      setShippingCost(finalShipping.shippingCost);
    } else {
      setShippingCost(0);
    }
  }, [quantities]);

  // Auto-lookup ZIP code when city and state are entered
  const handleCityBlur = async () => {
    const city = form.getValues("shippingCity");
    const state = form.getValues("shippingState");
    
    if (city && state && city.length > 2) {
      setIsLookingUpZip(true);
      
      // First try local lookup
      const localZip = findZipByCity(city, state);
      if (localZip) {
        form.setValue("shippingZip", localZip);
        setIsLookingUpZip(false);
        return;
      }

      // Fallback to API lookup
      try {
        const response = await fetch(`https://api.zippopotam.us/us/${state}/${encodeURIComponent(city)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            const zip = data.places[0]['post code'];
            form.setValue("shippingZip", zip);
          }
        }
      } catch (error) {
        console.warn('ZIP lookup failed:', error);
      } finally {
        setIsLookingUpZip(false);
      }
    }
  };

  // Reset form and state when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setShirtSizes([]);
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
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <h3 className="text-metal-gold font-semibold mb-3">Eyes on Empire T-Shirt ($25.00)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="shirtQuantity" className="text-sm">Quantity</Label>
                <Input
                  id="shirtQuantity"
                  type="number"
                  min="0"
                  {...form.register("shirtQuantity", { valueAsNumber: true })}
                  className="bg-medium-gray border-metal-gold/30 text-white"
                />
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
            <h3 className="text-metal-gold font-semibold mb-3">Headrust Trucker Hat ($30.00)</h3>
            <div className="space-y-2">
              <Label htmlFor="hatQuantity" className="text-sm">Quantity</Label>
              <Input
                id="hatQuantity"
                type="number"
                min="0"
                {...form.register("hatQuantity", { valueAsNumber: true })}
                className="bg-medium-gray border-metal-gold/30 text-white"
              />
            </div>
          </div>

          {/* Album Selection */}
          <div className="border-t border-metal-gold/20 pt-4">
            <h3 className="text-metal-gold font-semibold mb-3">Limited Edition 12" Record ($35.00)</h3>
            <div className="space-y-2">
              <Label htmlFor="albumQuantity" className="text-sm">Quantity</Label>
              <Input
                id="albumQuantity"
                type="number"
                min="0"
                {...form.register("albumQuantity", { valueAsNumber: true })}
                className="bg-medium-gray border-metal-gold/30 text-white"
              />
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border-t border-metal-gold/20 pt-4">
            <h3 className="text-metal-gold font-semibold mb-3">Shipping Information</h3>
            <p className="text-xs text-gray-400 mb-3">Continental US shipping only. Free shipping on orders $100+</p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="shippingCity" className="text-sm">City *</Label>
                <Input
                  id="shippingCity"
                  {...form.register("shippingCity")}
                  className="bg-medium-gray border-metal-gold/30 text-white"
                  placeholder="Your city"
                  onBlur={handleCityBlur}
                />
                {form.formState.errors.shippingCity && (
                  <p className="text-red-400 text-sm">{form.formState.errors.shippingCity.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="shippingState" className="text-sm">State *</Label>
                  <Select onValueChange={(value) => {
                    form.setValue("shippingState", value);
                    // Trigger ZIP lookup when state changes if city is already filled
                    setTimeout(handleCityBlur, 100);
                  }}>
                    <SelectTrigger className="bg-medium-gray border-metal-gold/30 text-white">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {US_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.shippingState && (
                    <p className="text-red-400 text-sm">{form.formState.errors.shippingState.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingZip" className="text-sm">
                    ZIP Code * {isLookingUpZip && <span className="text-xs text-yellow-400">(looking up...)</span>}
                  </Label>
                  <Input
                    id="shippingZip"
                    {...form.register("shippingZip")}
                    className="bg-medium-gray border-metal-gold/30 text-white"
                    placeholder="Auto-filled from city"
                    maxLength={10}
                  />
                  {form.formState.errors.shippingZip && (
                    <p className="text-red-400 text-sm">{form.formState.errors.shippingZip.message}</p>
                  )}
                  <p className="text-xs text-gray-400">ZIP code will auto-fill when you enter city and state</p>
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
                  {subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0 ? 'FREE' : 
                   shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Calculated at checkout'}
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