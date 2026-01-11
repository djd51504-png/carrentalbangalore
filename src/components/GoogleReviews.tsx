import { Star, Quote, ExternalLink } from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    date: "2 weeks ago",
    text: "Amazing experience with Key2Go! Rented a Swift for a weekend trip to Coorg. Car was in excellent condition and the booking process was super smooth through WhatsApp. Will definitely use again!",
    avatar: "RS"
  },
  {
    name: "Priya Menon",
    rating: 5,
    date: "1 month ago",
    text: "Best self-drive car rental in Bangalore! Picked up an Innova from Hebbal for a family trip to Mysore. Clean car, transparent pricing, and no hidden charges. Highly recommended!",
    avatar: "PM"
  },
  {
    name: "Vikram Reddy",
    rating: 5,
    date: "3 weeks ago",
    text: "Used Key2Go for a business trip. The Creta was spotless and well-maintained. 24/7 support is genuine - they helped me with a minor issue at midnight. Great service!",
    avatar: "VR"
  },
  {
    name: "Anjali Nair",
    rating: 5,
    date: "1 week ago",
    text: "Rented a Fortuner for a trip to Chikmagalur. The car was brand new and the whole experience was hassle-free. Very professional team. 5 stars!",
    avatar: "AN"
  },
  {
    name: "Mohammed Farhan",
    rating: 5,
    date: "2 months ago",
    text: "Excellent fleet of cars and very responsive customer service. Booked a Baleno for 3 days and got great value for money. The 300km daily limit is very generous!",
    avatar: "MF"
  },
  {
    name: "Sneha Kulkarni",
    rating: 5,
    date: "1 month ago",
    text: "First time using a self-drive service and Key2Go made it so easy! The pickup from Bellandur was quick and the car (i20) was perfect. Will be a regular customer now!",
    avatar: "SK"
  }
];

const GoogleReviews = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Customer Reviews
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by 500+ Happy Customers
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">5.0</span>
            <span className="text-muted-foreground">on Google Maps</span>
          </div>
          <a
            href="https://maps.app.goo.gl/xsq6bDgZ4WmjUDt59"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View all reviews on Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-card-hover transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-bold">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">{review.name}</h4>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                "{review.text}"
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12" data-aos="fade-up">
          <a
            href="https://wa.me/919448277091?text=Hi%2C%20I%20want%20to%20book%20a%20car"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-whatsapp to-emerald-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Join Our Happy Customers
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
