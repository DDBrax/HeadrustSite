import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const customRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  customRequest: z.string().min(10, "Please describe what you'd like customized (at least 10 characters)"),
});

type CustomRequestData = z.infer<typeof customRequestSchema>;

export default function SimpleCustomForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CustomRequestData>({
    resolver: zodResolver(customRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      customRequest: "",
    },
  });

  const customRequestMutation = useMutation({
    mutationFn: async (data: CustomRequestData) => {
      // Send as a contact message with special subject
      const contactData = {
        name: data.name,
        email: data.email,
        subject: "Custom Request - What can we customize for you?",
        message: data.customRequest,
        inquiryType: "general",
      };
      
      const response = await apiRequest('POST', '/api/contact', contactData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Custom Request Submitted!",
        description: "Thank you! We'll review your request and get back to you with customization options.",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to Submit Request",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
      console.error('Custom request error:', error);
    },
  });

  const onSubmit = (data: CustomRequestData) => {
    customRequestMutation.mutate(data);
  };

  return (
    <Card className="bg-black/50 border-metal-gold/30 hover:border-metal-gold/50 transition-all duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-metal text-metal-gold">
          <i className="fas fa-tools mr-2"></i>
          SUPPORT HEADRUST
        </CardTitle>
        <CardDescription className="text-gray-300">
          Custom merchandise and personalized items
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-300 leading-relaxed">
          Want something unique? We can create custom merchandise, 
          personalized items, or special orders just for you.
        </p>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold text-lg px-8 py-3 w-full">
              <i className="fas fa-magic mr-2"></i>
              What Can We Customize?
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-black border-metal-gold/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-metal text-metal-gold text-center">
                Custom Request
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center">
                Tell us what you'd like us to customize for you
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-metal-gold">Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field} 
                          className="bg-gray-900 border-gray-700 text-white focus:border-metal-gold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-metal-gold">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email" 
                          {...field} 
                          className="bg-gray-900 border-gray-700 text-white focus:border-metal-gold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customRequest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-metal-gold">What can we customize for you?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you'd like customized... (custom t-shirt design, personalized vinyl, special merchandise, etc.)"
                          {...field}
                          rows={4}
                          className="bg-gray-900 border-gray-700 text-white focus:border-metal-gold resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={customRequestMutation.isPending}
                    className="flex-1 bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold"
                  >
                    {customRequestMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <div className="text-xs text-gray-400 mt-4">
          <i className="fas fa-info-circle mr-1"></i>
          Response within 24-48 hours with customization options
        </div>
      </CardContent>
    </Card>
  );
}