import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Monitor, Wrench, Camera, GraduationCap, ShoppingBag } from "lucide-react";

const services = [
  { icon: Code, title: "Software Development", desc: "Custom web and mobile applications tailored to your business needs." },
  { icon: Monitor, title: "IT Support", desc: "Reliable technical support and troubleshooting for businesses and individuals." },
  { icon: GraduationCap, title: "Mentoring & Coaching", desc: "One-on-one and group coaching in AI, data analytics, and software engineering." },
  { icon: Wrench, title: "Hardware Repairs", desc: "Expert diagnosis and repair for laptops, desktops, and peripherals." },
  { icon: Camera, title: "CCTV Installation", desc: "Professional security camera installation and configuration." },
  { icon: ShoppingBag, title: "Sales of Laptops & Accessories", desc: "Wide range of computers, parts, and accessories at competitive prices." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Header */}
    <div className="mt-16 gradient-primary py-16 text-center">
      <p className="max-w-3xl mx-auto px-4 text-primary-foreground text-lg sm:text-xl leading-relaxed">
        At Kellastech E-commerce, we make shopping simple, fast, and enjoyable. Our platform is designed to bring quality products closer to you, with trusted vendors, affordable prices, and a smooth user experience from browsing to delivery.
      </p>
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Mission / Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { title: "Our Mission", text: "To bridge the gap between technology and businesses in Ghana by providing quality hardware, accessories, and IT services at affordable prices." },
          { title: "Our Vision", text: "To become Ghana's leading one-stop technology solutions provider, empowering individuals and businesses through accessible tech." },
          { title: "Who We Are", text: "KELLASTECH is a Ghana-based technology company offering computer sales, IT support, mentoring, hardware repairs, CCTV installations, and software development." },
        ].map((card) => (
          <div key={card.title} className="bg-card border border-primary/20 rounded-xl p-6 card-hover">
            <div className="w-12 h-1 gradient-primary rounded mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-foreground mb-3">Our Services</h2>
        <p className="text-muted-foreground">Comprehensive technology solutions for all your needs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {services.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-primary/10 rounded-xl p-6 card-hover">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-primary-foreground font-bold text-lg rounded-xl glow-primary hover:opacity-90 transition-all"
        >
          Browse Our Store <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>

    <Footer />
  </div>
);

export default About;
