import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  contactInquiryTypeSchema,
  contactSubmissionSchema,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const contactFormSchema = contactSubmissionSchema.extend({
  inquiryType: contactInquiryTypeSchema,
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const inquirySubjects: Record<ContactFormValues["inquiryType"], string> = {
  booking: "Booking Request",
  press: "Press Inquiry",
  collaboration: "Collaboration",
  general: "General Inquiry",
  fan: "Fan Mail",
  other: "Other Inquiry",
};

interface ContactFormModalProps {
  children: React.ReactNode;
}

export default function ContactFormModal({ children }: ContactFormModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest('POST', '/api/contact', {
        ...data,
        subject: inquirySubjects[data.inquiryType],
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
      console.error('Contact form error:', error);
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-black border border-metal-gold/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-metal text-metal-gold text-center">
            CONTACT & BOOKING FORM
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-metal-gold font-semibold">Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      className="bg-gray-900 border border-metal-gold/20 text-white focus:border-metal-gold focus:ring-metal-gold"
                      data-testid="input-name"
                      {...field}
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
                  <FormLabel className="text-metal-gold font-semibold">Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-gray-900 border border-metal-gold/20 text-white focus:border-metal-gold focus:ring-metal-gold"
                      data-testid="input-email"
                      {...field}
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
                  <FormLabel className="text-metal-gold font-semibold">Inquiry Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger 
                        className="bg-gray-900 border border-metal-gold/20 text-white focus:border-metal-gold focus:ring-metal-gold"
                        data-testid="select-inquiry-type"
                      >
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border border-metal-gold/20">
                      <SelectItem value="booking">Booking Request</SelectItem>
                      <SelectItem value="press">Press Inquiry</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="fan">Fan Mail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-metal-gold font-semibold">Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      className="bg-gray-900 border border-metal-gold/20 text-white focus:border-metal-gold focus:ring-metal-gold resize-none"
                      data-testid="textarea-message"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={contactMutation.isPending}
                className="flex-1 bg-metal-gold hover:bg-metal-gold/80 text-black font-bold transition-all duration-300"
                data-testid="button-submit"
              >
                {contactMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    SENDING...
                  </>
                ) : (
                  <>
                    SEND MESSAGE <i className="fas fa-paper-plane ml-2"></i>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
