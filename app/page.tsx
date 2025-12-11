import {
  ArrowRight,
  Home,
  TrendingUp,
  Shield,
  CheckCircle,
  Users,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import PropertyGridClient from "@/components/organisms/PropertyGridClient";
import { ENTERPRISE } from "@/utils/enterprise";
import { ENDPOINTS } from "@/lib/constants";

const mockProperties = [
  {
    id: "1",
    title: "Modern downtown apartment",
    price: 350000,
    location: "Downtown, New York",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    status: "available" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "Apartment",
  },
  {
    id: "2",
    title: "Family house with garden",
    price: 450000,
    location: "Suburbs, Los Angeles",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    status: "pending" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "House",
  },
  {
    id: "3",
    title: "Penthouse with terrace",
    price: 520000,
    location: "Manhattan, New York",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    status: "available" as const,
    image: "/placeholder.svg?height=200&width=300",
    type: "Penthouse",
  },
];

const features = [
  {
    icon: Home,
    title: "Property Management",
    description:
      "Manage your property portfolio with advanced tools and intuitive visualization.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Transaction Tracking",
    description:
      "Monitor the progress of each transaction with detailed checklists and automatic notifications.",
    color: "secondary",
  },
  {
    icon: Shield,
    title: "Security and Trust",
    description:
      "Secure platform with data encryption and industry compliance.",
    color: "tertiary",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary font-primary">
                {ENTERPRISE.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`${ENDPOINTS.auth0.SIGNUP}&returnTo=/api/auth/login-callback`}
              >
                <Button variant="ghost">Sign Up</Button>
              </Link>
              <Link
                href={`${ENDPOINTS.auth0.LOGIN}?returnTo=/api/auth/login-callback`}
              >
                <Button>Login</Button>
              </Link>
              <Link href={ENDPOINTS.auth0.LOGOUT}>
                <Button>Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-card via-background to-card overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-primary leading-tight">
                  Real Estate
                  <span className="block text-primary">Management</span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-normal">
                    Simplified
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl font-secondary leading-relaxed">
                  {ENTERPRISE.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`${ENDPOINTS.auth0.SIGNUP}&returnTo=/api/auth/login-callback`}
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 w-full sm:w-auto"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link
                  href={`${ENDPOINTS.auth0.LOGIN}?returnTo=/api/auth/login-callback`}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 w-full sm:w-auto"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-primary/10 rounded-lg p-4">
                        <BarChart className="w-8 h-8 text-primary mb-2" />
                        <div className="h-3 bg-primary/20 rounded w-full"></div>
                      </div>
                      <div className="bg-secondary/10 rounded-lg p-4">
                        <Home className="w-8 h-8 text-secondary mb-2" />
                        <div className="h-3 bg-secondary/20 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-primary">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground font-secondary max-w-3xl mx-auto">
              Powerful tools designed specifically for real estate professionals
              and their clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 font-secondary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-primary">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground font-secondary">
              Discover some of the best available properties
            </p>
          </div>

          <PropertyGridClient properties={mockProperties} />

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4 font-primary">
              PropManager
            </h3>
            <p className="text-muted-foreground mb-8">
              The complete solution for modern real estate management
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
