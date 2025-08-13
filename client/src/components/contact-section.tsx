import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const contactFormSchema = insertContactMessageSchema.extend({});

export default function ContactSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/contact-messages'] });
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

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="section-padding bg-black">
      <div className="container-padding">
        <h2 className="text-5xl font-metal text-center text-metal-gold mb-8">CONTACT</h2>
        
        <div className="text-center mb-12">
          <Link href="/contact">
            <Button className="bg-metal-gold hover:bg-metal-gold/80 text-black font-semibold text-lg px-8 py-3">
              <i className="fas fa-paper-plane mr-2"></i>
              Contact & Booking Form
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            Professional booking inquiries, press requests, and general contact
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-metal text-metal-gold mb-6">GET IN TOUCH</h3>
            <div className="space-y-6 text-gray-300">
              <div className="flex items-start space-x-4">
                <i className="fas fa-envelope text-metal-gold text-xl mt-1"></i>
                <div>
                  <div className="font-semibold text-white">Management</div>
                  <div>management@headrust.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <i className="fas fa-ticket-alt text-metal-gold text-xl mt-1"></i>
                <div>
                  <div className="font-semibold text-white">Bookings</div>
                  <div>bookings@headrust.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <i className="fas fa-newspaper text-metal-gold text-xl mt-1"></i>
                <div>
                  <div className="font-semibold text-white">Press</div>
                  <div>press@headrust.com</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-xl font-metal text-metal-gold mb-4">FOLLOW US</h4>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/HeadRust" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-2xl transition-colors duration-300">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-metal-gold text-2xl transition-colors duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com/headrust_az/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-2xl transition-colors duration-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.youtube.com/channel/UCwMAtSScGWm5Oz79ZpTJs8A" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metal-gold text-2xl transition-colors duration-300">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-metal-gold text-2xl transition-colors duration-300">
                  <i className="fab fa-spotify"></i>
                </a>
              </div>
            </div>
          </div>
          
          <Card className="bg-dark-gray border border-metal-gold/20">
            <CardContent className="p-6">
              <h3 className="text-2xl font-metal text-metal-gold mb-6">SEND MESSAGE</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            className="w-full bg-dark-gray border border-metal-gold/20 text-white focus:border-metal-gold"
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
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Your Email"
                            className="w-full bg-dark-gray border border-metal-gold/20 text-white focus:border-metal-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-dark-gray border border-metal-gold/20 text-white focus:border-metal-gold">
                              <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="booking">Booking Inquiry</SelectItem>
                            <SelectItem value="press">Press Inquiry</SelectItem>
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
                        <FormControl>
                          <Textarea
                            placeholder="Your Message"
                            rows={6}
                            className="w-full bg-dark-gray border border-metal-gold/20 text-white focus:border-metal-gold"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="w-full bg-metal-gold hover:bg-yellow-400 text-black font-bold py-3 px-6 transition-all duration-300 transform hover:scale-105"
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
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
