import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const customOrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  shirtQuantity: z.number().min(0),
  shirtSize: z.string().optional(),
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

  const form = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      shirtQuantity: 0,
      shirtSize: "",
      hatQuantity: 0,
      albumQuantity: 0,
    },
  });

  const submitOrderMutation = useMutation({
    mutationFn: (data: CustomOrderForm) => 
      apiRequest("/api/custom-order", "POST", data),
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

    // If shirt is selected, size is required
    if (data.shirtQuantity > 0 && !data.shirtSize) {
      toast({
        title: "Shirt Size Required",
        description: "Please select a size for the t-shirt.",
        variant: "destructive",
      });
      return;
    }

    submitOrderMutation.mutate(data);
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
      <DialogContent className="bg-dark-gray border border-metal-gold/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-metal-gold text-xl">
            Custom Order Request
          </DialogTitle>
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
              <div className="space-y-2">
                <Label htmlFor="shirtSize" className="text-sm">Size</Label>
                <Select onValueChange={(value) => form.setValue("shirtSize", value)}>
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