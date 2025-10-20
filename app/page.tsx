import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Leaf, Recycle, TrendingUp, Award, MapPin, Upload, BarChart3, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image";

export default function Page() {
    return (
        <main className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                                <Image
                                    src="/sortex_logo.webp"
                                    alt="Sortex Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <span className="text-xl font-bold">Sortex</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <SignedOut>
                            <SignInButton>
                                <Button variant="ghost">Sign In</Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button>Get Started</Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <Badge variant="secondary" className="w-fit">
                                <Leaf className="w-3 h-3 mr-1" />
                                Gamified Sustainability
                            </Badge>
                            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
                                Turn Recycling Into
                                <span className="text-primary block mt-2">Rewards</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
                                Upload photos of your recyclables, earn points, and make a real environmental impact. Join thousands
                                making sustainability rewarding.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <SignedOut>
                                    <SignUpButton>
                                        <Button size="lg" className="text-lg px-8 py-6 group">
                                            Start Earning Points
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </SignUpButton>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                                        Learn More
                                    </Button>
                                </SignedOut>
                                <SignedIn>
                                    <Link href="/upload">
                                        <Button size="lg" className="text-lg px-8 py-6 group">
                                            Upload Recyclables
                                            <Upload className="w-5 h-5 ml-2 group-hover:translate-y-[-2px] transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                                            View Dashboard
                                        </Button>
                                    </Link>
                                </SignedIn>
                            </div>
                        </div>

                        {/* Hero Image Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="aspect-square overflow-hidden">
                                <img src="/person-holding-recycled-plastic-bottles.jpg" alt="Recycling plastic" className="w-full h-full object-cover" />
                            </Card>
                            <Card className="aspect-square overflow-hidden">
                                <img src="/glass-bottles-being-recycled-in-green-bin.jpg" alt="Glass recycling" className="w-full h-full object-cover" />
                            </Card>
                            <Card className="aspect-square overflow-hidden">
                                <img src="/cardboard-and-paper-recycling-collection.jpg" alt="Paper recycling" className="w-full h-full object-cover" />
                            </Card>
                            <Card className="aspect-square overflow-hidden">
                                <img
                                    src="/electronic-waste-recycling-center.jpg"
                                    alt="Electronics recycling"
                                    className="w-full h-full object-cover"
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-20 bg-secondary/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold text-primary">2.5M+</div>
                            <div className="text-muted-foreground">Items Recycled</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold text-primary">150K+</div>
                            <div className="text-muted-foreground">Active Users</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold text-primary">500T</div>
                            <div className="text-muted-foreground">CO₂ Saved</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-5xl font-bold text-primary">98%</div>
                            <div className="text-muted-foreground">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-5xl font-bold">How It Works</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                            Three simple steps to start earning rewards while saving the planet
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 space-y-6 hover:scale-105 transition-transform">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                                <Smartphone className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-3">
                                <div className="text-3xl font-bold">1. Upload</div>
                                <h3 className="text-2xl font-bold">Snap & Share</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Take a photo of your recyclable items - plastic, glass, paper, metal, or electronics. Our AI instantly
                                    identifies the material.
                                </p>
                            </div>
                        </Card>

                        <Card className="p-8 space-y-6 hover:scale-105 transition-transform">
                            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center">
                                <Award className="w-8 h-8 text-accent" />
                            </div>
                            <div className="space-y-3">
                                <div className="text-3xl font-bold">2. Earn</div>
                                <h3 className="text-2xl font-bold">Collect Points</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Earn points based on the type and quantity of items recycled. Plastic earns 25pts, glass 35pts, and
                                    electronics up to 50pts!
                                </p>
                            </div>
                        </Card>

                        <Card className="p-8 space-y-6 hover:scale-105 transition-transform">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-3">
                                <div className="text-3xl font-bold">3. Impact</div>
                                <h3 className="text-2xl font-bold">Track Progress</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Watch your environmental impact grow. Compete on leaderboards and see your contribution to a cleaner
                                    planet.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Recycling Types */}
            <section className="py-20 bg-secondary/30 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-5xl font-bold">What You Can Recycle</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                            We accept a wide range of recyclable materials with varying point rewards
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <Card className="p-6 text-center space-y-4 hover:border-primary transition-colors">
                            <div className="aspect-square bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                                <img src="/plastic-bottle-icon.webp" alt="Plastic" className="w-96 h-36 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold">Plastic</h3>
                            <div className="text-2xl font-bold text-primary">25 pts</div>
                            <p className="text-sm text-muted-foreground">Bottles, containers, packaging</p>
                        </Card>

                        <Card className="p-6 text-center space-y-4 hover:border-primary transition-colors">
                            <div className="aspect-square bg-accent/10 rounded-2xl flex items-center justify-center mb-2">
                                <img src="/glass-bottle-icon.webp" alt="Glass" className="w-96 h-36 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold">Glass</h3>
                            <div className="text-2xl font-bold text-accent">35 pts</div>
                            <p className="text-sm text-muted-foreground">Bottles, jars, containers</p>
                        </Card>

                        <Card className="p-6 text-center space-y-4 hover:border-primary transition-colors">
                            <div className="aspect-square bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                                <img src="/paper-stack-icon.jpg.png " alt="Paper" className="w-96 h-36 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold">Paper</h3>
                            <div className="text-2xl font-bold text-primary">20 pts</div>
                            <p className="text-sm text-muted-foreground">Cardboard, newspapers, magazines</p>
                        </Card>

                        <Card className="p-6 text-center space-y-4 hover:border-primary transition-colors">
                            <div className="aspect-square bg-accent/10 rounded-2xl flex items-center justify-center mb-2">
                                <img src="/aluminium-can-icon.webp" alt="Metal" className="w-96 h-36 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold">Metal</h3>
                            <div className="text-2xl font-bold text-accent">30 pts</div>
                            <p className="text-sm text-muted-foreground">Cans, foil, scrap metal</p>
                        </Card>

                        <Card className="p-6 text-center space-y-4 hover:border-primary transition-colors">
                            <div className="aspect-square bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                                <img src="/electronic-device-icon.webp" alt="Electronics" className="w-96 h-36 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold">Electronics</h3>
                            <div className="text-2xl font-bold text-primary">50 pts</div>
                            <p className="text-sm text-muted-foreground">Phones, batteries, cables</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl font-bold text-balance leading-tight">Track Your Impact in Real-Time</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Personal Dashboard</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            View your recycling history, points earned, and environmental impact metrics all in one place.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Find Recycling Centers</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Locate nearby recycling centers with our interactive map and get directions instantly.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Award className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Compete & Win</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Climb the leaderboard, earn badges, and compete with friends to see who can make the biggest
                                            impact.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Card className="aspect-[4/3] overflow-hidden">
                            <img src="/modern-dashboard-showing-recycling-statistics-and-.jpg" alt="Dashboard preview" className="w-full h-full object-cover" />
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 bg-gradient-to-br from-primary/20 via-background to-accent/20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-6xl font-bold text-balance leading-tight">Ready to Make a Difference?</h2>
                    <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                        Join thousands of eco-conscious individuals turning everyday recycling into meaningful rewards and
                        environmental impact.
                    </p>
                    <SignedOut>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <SignUpButton>
                                <Button size="lg" className="text-lg px-12 py-7 group">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SignUpButton>
                            <Button size="lg" variant="outline" className="text-lg px-12 py-7 bg-transparent">
                                <MapPin className="w-5 h-5 mr-2" />
                                Find Recycling Centers
                            </Button>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/upload">
                                <Button size="lg" className="text-lg px-12 py-7 group">
                                    Start Recycling Now
                                    <Upload className="w-5 h-5 ml-2 group-hover:translate-y-[-2px] transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/map">
                                <Button size="lg" variant="outline" className="text-lg px-12 py-7 bg-transparent">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Find Centers Near You
                                </Button>
                            </Link>
                        </div>
                    </SignedIn>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-secondary/50 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                                        <Image
                                            src="/sortex_logo.webp"
                                            alt="Sortex Logo"
                                            width={40}
                                            height={40}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">Sortex</span>
                            </div>
                            <p className="text-muted-foreground max-w-md leading-relaxed">
                                Making sustainability rewarding. Turn your recycling efforts into points, track your environmental
                                impact, and join a community committed to a cleaner planet.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">Platform</h4>
                            <div className="space-y-2 text-muted-foreground">
                                <div>Dashboard</div>
                                <div>Upload</div>
                                <div>Map</div>
                                <div>Leaderboard</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">Company</h4>
                            <div className="space-y-2 text-muted-foreground">
                                <div>About Us</div>
                                <div>Contact</div>
                                <div>Privacy Policy</div>
                                <div>Terms of Service</div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center text-muted-foreground">
                        <p>&copy; 2025 EcoRewards. Making the world greener, one upload at a time.</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
