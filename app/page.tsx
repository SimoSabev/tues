import {createClient} from '@/utils/supabase/server'
import {cookies} from 'next/headers'
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Clock, Leaf, MapPin, Music, Play, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";

export default async function Page() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {data: todos} = await supabase.from('todos').select()

    return (
        <main>
            <section className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[80vh]">
                        {/* Main Hero Content */}
                        <div className="lg:col-span-8 flex flex-col justify-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Badge variant="secondary" className="w-fit">
                                        <Music className="w-3 h-3 mr-1"/>
                                        Live Music & Plants
                                    </Badge>
                                    <h1 className="text-6xl lg:text-8xl font-bold tracking-tight text-balance">
                                        Where Music
                                        <span className="text-primary block">Grows Wild</span>
                                    </h1>
                                    <p className="text-xl text-muted-foreground max-w-2xl text-pretty">
                                        A unique fusion of live acoustic performances and botanical beauty. Sip artisan
                                        coffee surrounded by
                                        lush greenery while discovering emerging artists.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <SignedOut>
                                        <SignUpButton forceRedirectUrl="/redirect-after-signin">
                                            <Button
                                                size="lg"
                                                className="group relative overflow-hidden rounded-2xl px-8 py-6 md:px-12 md:py-8 text-lg md:text-xl font-bold transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto min-w-[280px] bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white border-0 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70"
                                            >
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                                    style={{
                                                        backgroundSize: '200% 200%'
                                                    }}
                                                />
                                                <span className="relative flex items-center justify-center gap-3">
                                                    Get Started Free
                                                <div>
                                                    <ArrowRight
                                                        className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"/>
                                                </div>
                                            </span>
                                            </Button>
                                        </SignUpButton>

                                        <SignInButton forceRedirectUrl="/redirect-after-signin">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="group relative overflow-hidden rounded-2xl px-8 py-6 md:px-12 md:py-8 text-lg md:text-xl font-bold transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto min-w-[280px] border-2 border-white/30 hover:border-white/60 bg-white/5 backdrop-blur-xl hover:bg-white/10 shadow-xl"
                                            >
                                <span
                                    className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                                    Sign In
                                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"/>
                                </span>
                                            </Button>
                                        </SignInButton>
                                    </SignedOut>

                                    <SignedIn>
                                        <div
                                            className="flex items-center gap-6 px-8 py-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
                                        >
                                            <UserButton
                                                appearance={{
                                                    elements: {
                                                        userButtonAvatarBox:
                                                            "w-12 h-12 md:w-16 md:h-16 ring-2 ring-purple-500/50 ring-offset-2 md:ring-offset-4 ring-offset-background transition-all duration-300 hover:ring-purple-400",
                                                        userButtonPopoverCard: "bg-card backdrop-blur-sm border border-border shadow-2xl",
                                                        userButtonPopoverActionButton: "hover:bg-accent transition-colors",
                                                    },
                                                }}
                                            />
                                            <div className="text-left">
                                                <span
                                                    className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                                                    Welcome back!
                                                </span>
                                                <p className="text-sm text-muted-foreground">Ready to continue your
                                                    journey?</p>
                                            </div>
                                        </div>
                                    </SignedIn>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Grid */}
                        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                            <Card className="aspect-square bg-card overflow-hidden">
                                <img
                                    src="/acoustic-guitar-player-in-plant-filled-cafe.jpg"
                                    alt="Acoustic performance"
                                    className="w-full h-full object-cover"
                                />
                            </Card>
                            <Card className="aspect-square bg-primary/20 overflow-hidden">
                                <img src="/lush-green-plants-and-hanging-gardens-in-cafe.jpg" alt="Plant atmosphere"
                                     className="w-full h-full object-cover"/>
                            </Card>
                            <Card className="aspect-square bg-accent/20 overflow-hidden">
                                <img src="/artisan-coffee-and-pastries-on-wooden-table.jpg" alt="Artisan coffee"
                                     className="w-full h-full object-cover"/>
                            </Card>
                            <Card className="aspect-square bg-card overflow-hidden">
                                <img src="/intimate-music-venue-with-plants-and-warm-lighting.jpg" alt="Intimate venue"
                                     className="w-full h-full object-cover"/>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-secondary/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">THE VERDANT EXPERIENCE</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
                            Our process that begins and ends with culture - where music, nature, and community converge
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 text-center">
                            <div
                                className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Music className="w-8 h-8 text-primary"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">1. Discover</h3>
                            <p className="text-muted-foreground">
                                We help you discover new sounds and artists in an intimate setting where every note
                                resonates.
                            </p>
                        </Card>

                        <Card className="p-8 text-center">
                            <div
                                className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Leaf className="w-8 h-8 text-accent"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">2. Connect</h3>
                            <p className="text-muted-foreground">
                                Connect with nature and community in our botanical oasis designed for mindful listening.
                            </p>
                        </Card>

                        <Card className="p-8 text-center">
                            <div
                                className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-primary"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">3. Grow</h3>
                            <p className="text-muted-foreground">
                                Watch artists and community flourish in a space that nurtures creativity and authentic
                                connections.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section id="events" className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-4xl font-bold">UPCOMING SHOWS</h2>
                        <Button variant="outline">View All Events</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="aspect-video bg-primary/20 relative overflow-hidden">
                                <img
                                    src="/indie-folk-singer-with-acoustic-guitar-in-intimate.jpg"
                                    alt="Luna Rivers performance"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <Badge className="absolute top-4 left-4">Tonight</Badge>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Luna Rivers</h3>
                                <p className="text-muted-foreground mb-4">Indie folk with botanical storytelling</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4"/>
                                        8:00 PM
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4"/>
                                        25 seats
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="aspect-video bg-accent/20 relative overflow-hidden">
                                <img
                                    src="/jazz-trio-performing-in-plant-filled-venue.jpg"
                                    alt="The Greenhouse Trio"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <Badge className="absolute top-4 left-4" variant="secondary">
                                    Tomorrow
                                </Badge>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">The Greenhouse Trio</h3>
                                <p className="text-muted-foreground mb-4">Jazz fusion meets nature sounds</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4"/>
                                        7:30 PM
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4"/>
                                        30 seats
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="aspect-video bg-primary/20 relative overflow-hidden">
                                <img
                                    src="/electronic-ambient-musician-with-synthesizers-and-.jpg"
                                    alt="Moss & Circuits"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <Badge className="absolute top-4 left-4" variant="outline">
                                    This Weekend
                                </Badge>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Moss & Circuits</h3>
                                <p className="text-muted-foreground mb-4">Ambient electronic with live plant sensors</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4"/>
                                        9:00 PM
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4"/>
                                        40 seats
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 text-balance">Cultivating Sound in Living Spaces</h2>
                            <div className="space-y-6 text-lg text-muted-foreground">
                                <p>
                                    Verdant Sound is more than a venue—it's an ecosystem where music and nature create
                                    symbiotic
                                    experiences. Our space features over 200 carefully curated plants that respond to
                                    sound frequencies,
                                    creating a living, breathing backdrop for intimate performances.
                                </p>
                                <p>
                                    Every corner tells a story of growth, from our coffee sourced from musician-owned
                                    farms to our
                                    acoustic design that lets both music and nature flourish together.
                                </p>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-primary">200+</div>
                                    <div className="text-muted-foreground">Living Plants</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-accent">50+</div>
                                    <div className="text-muted-foreground">Artists Monthly</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <Card className="aspect-[4/5] overflow-hidden">
                                <img
                                    src="/lush-indoor-garden-cafe-with-hanging-plants-and-na.jpg"
                                    alt="Verdant Sound interior"
                                    className="w-full h-full object-cover"
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-bold mb-6 text-balance">Ready to Experience Music That Grows?</h2>
                    <p className="text-xl text-muted-foreground mb-8 text-balance">
                        Join our community of music lovers and plant enthusiasts. Reserve your spot for an unforgettable
                        evening
                        where sound and nature unite.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8">
                            Reserve Your Table
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                            <MapPin className="w-4 h-4 mr-2"/>
                            Visit Us
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-secondary/50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <div className="text-2xl font-bold mb-4">VERDANT SOUND</div>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Where music and nature create unforgettable experiences. Join us for intimate
                                performances in our
                                botanical oasis.
                            </p>
                            <div className="flex gap-4">
                                <Button variant="outline" size="sm">
                                    Instagram
                                </Button>
                                <Button variant="outline" size="sm">
                                    Spotify
                                </Button>
                                <Button variant="outline" size="sm">
                                    Newsletter
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Visit</h4>
                            <div className="space-y-2 text-muted-foreground">
                                <p>123 Garden Street</p>
                                <p>Music District</p>
                                <p>Open Daily 7AM - 11PM</p>
                                <p>(555) 123-GROW</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Experience</h4>
                            <div className="space-y-2 text-muted-foreground">
                                <p>Live Music</p>
                                <p>Plant Workshops</p>
                                <p>Private Events</p>
                                <p>Artist Residencies</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
                        <p>&copy; 2025 Verdant Sound. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
