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

const customOrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  shirtQuantity: z.number().min(0),
  shirtSizes: z.array(z.string()).optional(),
  hatQuantity: z.number().min(0),
  albumQuantity: z.number().min(0),
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

  const form = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      shirtQuantity: 0,
      shirtSizes: [],
      hatQuantity: 0,
      albumQuantity: 0,
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

    // If shirts are selected, sizes must match quantity
    if (data.shirtQuantity > 0 && (!data.shirtSizes || data.shirtSizes.length !== data.shirtQuantity)) {
      toast({
        title: "Shirt Sizes Required",
        description: `Please select ${data.shirtQuantity} shirt size${data.shirtQuantity > 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      return;
    }

    submitOrderMutation.mutate(data);
  };

  // Watch shirt quantity to update sizes array
  const shirtQuantity = form.watch("shirtQuantity");
  
  useEffect(() => {
    const newSizes = Array(Math.max(0, shirtQuantity)).fill("");
    setShirtSizes(newSizes);
    form.setValue("shirtSizes", newSizes);
  }, [shirtQuantity, form]);

  const updateShirtSize = (index: number, size: string) => {
    const updatedSizes = [...shirtSizes];
    updatedSizes[index] = size;
    setShirtSizes(updatedSizes);
    form.setValue("shirtSizes", updatedSizes.filter(s => s !== ""));
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                      <div key={index} className="flex items-center gap-2">
                        <Label className="text-xs text-gray-300 min-w-[50px]">
                          Shirt {index + 1}:
                        </Label>
                        <Select 
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

          {/* Order Total */}
          <div className="border-t border-metal-gold/20 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-metal-gold">Estimated Total:</span>
              <span className="text-white">${calculateTotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Final pricing includes shipping and will be confirmed via email
            </p>
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