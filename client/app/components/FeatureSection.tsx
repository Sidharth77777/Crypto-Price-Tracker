import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, LineChart, Shield, Smartphone } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      title: "Real-time Price Alerts",
      description:
        "Get instant notifications when your favorite cryptocurrencies hit your target prices. Never miss a trading opportunity.",
      icon: Bell,
    },
    {
      title: "Multiple Coin Monitoring",
      description:
        "Track multiple cryptocurrencies simultaneously with personalized alert settings. Stay updated on every move.",
      icon: LineChart,
    },
    {
      title: "Secure JWT Authentication",
      description:
        "Your data is protected with industry-standard JWT authentication and encryption. Trade with confidence.",
      icon: Shield,
    },
    {
      title: "Multi-device Sync",
      description:
        "Access your alerts and portfolio from anywhere. Seamlessly sync across all your devices in real-time.",
      icon: Smartphone,
    },
  ];

  return (
    <section id="featureSection" className="py-20 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-foreground font-semibold text-2xl sm:text-3xl mb-12">
          Everything you need to stay on top of the crypto market, all in one place.
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:px-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="border-border bg-card text-card-foreground hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="flex flex-col items-center justify-center gap-3 pt-6">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Icon size={28} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
