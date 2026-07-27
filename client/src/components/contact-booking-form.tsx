import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  inquiryType: z.enum(["general", "booking", "press", "collaboration"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message too long")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactBookingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      inquiryType: "general",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const getInquiryDescription = (type: string) => {
    switch (type) {
      case "booking":
        return "Interested in booking Headrust for a show? Include venue details, date, and budget.";
      case "press":
        return "Media inquiries, interviews, and press kit requests.";
      case "collaboration":
        return "Collaboration opportunities, guest features, or musical partnerships.";
      default:
        return "General questions, fan mail, or other inquiries.";
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto bg-black/50 border-metal-gold/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-metal-gold/10 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-2xl text-metal-gold"></i>
            </div>
            <h3 className="text-xl font-bold text-metal-gold">Message Sent!</h3>
            <p className="text-gray-300">
              Thanks for reaching out! We'll get back to you as soon as possible.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-metal-gold/20 text-metal-gold hover:bg-metal-gold/10"
            >
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-black/50 border-metal-gold/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-metal-gold">
          Contact & Booking
        </CardTitle>
        <CardDescription className="text-gray-300">
          Get in touch with Headrust for bookings, press inquiries, or general questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-black/30 border-metal-gold/20 text-white focus:border-metal-gold" 
                        placeholder="Your full name"
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
                    <FormLabel className="text-gray-200">Email *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        className="bg-black/30 border-metal-gold/20 text-white focus:border-metal-gold" 
                        placeholder="your.email@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-black/30 border-metal-gold/20 text-white focus:border-metal-gold" 
                        placeholder="(555) 123-4567"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inquiryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Inquiry Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-metal-gold/20 text-white focus:border-metal-gold">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-metal-gold/20">
                        <SelectItem value="general" className="text-white hover:bg-metal-gold/10">
                          General Inquiry
                        </SelectItem>
                        <SelectItem value="booking" className="text-white hover:bg-metal-gold/10">
                          Booking Request
                        </SelectItem>
                        <SelectItem value="press" className="text-white hover:bg-metal-gold/10">
                          Press/Media
                        </SelectItem>
                        <SelectItem value="collaboration" className="text-white hover:bg-metal-gold/10">
                          Collaboration
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-black/30 border-metal-gold/20 text-white focus:border-metal-gold" 
                      placeholder="Brief subject line"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Message *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-black/30 border-metal-gold/20 text-white focus:border-metal-gold min-h-[120px]" 
                      placeholder={getInquiryDescription(form.watch("inquiryType"))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-metal-gold/5 border border-metal-gold/20 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <i className="fas fa-info-circle text-metal-gold mr-2"></i>
                <strong>Booking Inquiries:</strong> Please include venue details, preferred dates, 
                expected attendance, and budget range. We typically respond within 24-48 hours.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={contactMutation.isPending}
              className="w-full bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold h-12"
            >
              {contactMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending Message...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
