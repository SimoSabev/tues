import {type Metadata} from 'next'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: "Sortex - Smart Recycling Map",
    description: "Find recycling points, earn eco points, and make a difference",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
            </body>
            </html>
        </ClerkProvider>
    )
}