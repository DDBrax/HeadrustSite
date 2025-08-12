import ContactBookingForm from "@/components/contact-booking-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-metal-gold hover:text-metal-gold/80">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Website
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-metal-gold mb-4">
            GET IN TOUCH
          </h1>
          <div className="w-24 h-1 bg-metal-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to book Headrust for your venue? Have a press inquiry? 
            Want to collaborate? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <ContactBookingForm />
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/50 border-metal-gold/20 text-center">
            <CardHeader>
              <CardTitle className="text-metal-gold flex items-center justify-center">
                <i className="fas fa-calendar-alt mr-2"></i>
                Booking
              </CardTitle>
              <CardDescription className="text-gray-300">
                Live performances and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Available for venues, festivals, private events, and special performances. 
                Professional metal experience since 2005.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-metal-gold/20 text-center">
            <CardHeader>
              <CardTitle className="text-metal-gold flex items-center justify-center">
                <i className="fas fa-newspaper mr-2"></i>
                Press & Media
              </CardTitle>
              <CardDescription className="text-gray-300">
                Interviews and media inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Press kit available upon request. High-resolution photos, 
                band bio, and interview availability.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-metal-gold/20 text-center">
            <CardHeader>
              <CardTitle className="text-metal-gold flex items-center justify-center">
                <i className="fas fa-handshake mr-2"></i>
                Collaboration
              </CardTitle>
              <CardDescription className="text-gray-300">
                Musical partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Open to guest features, studio collaborations, 
                and creative partnerships with fellow musicians.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Location Info */}
        <Card className="max-w-2xl mx-auto bg-black/50 border-metal-gold/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-metal-gold text-center">
              <i className="fas fa-map-marker-alt mr-2"></i>
              Tucson, Arizona
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Born and bred in the Sonoran Desert
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Headrust represents the authentic metal scene of Tucson, Arizona. 
              We're available for shows throughout the Southwest and beyond.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <i className="fas fa-road text-metal-gold mr-2"></i>
                <strong>Local Radius:</strong> Arizona, New Mexico, Nevada
              </div>
              <div>
                <i className="fas fa-plane text-metal-gold mr-2"></i>
                <strong>Travel:</strong> National tours considered
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            <i className="fas fa-clock text-metal-gold mr-2"></i>
            We typically respond to all inquiries within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
}