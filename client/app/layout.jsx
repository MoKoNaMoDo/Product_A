import './globals.css'
import { Inter, Sarabun } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sarabun = Sarabun({
    weight: ['300', '400', '500', '700'],
    subsets: ['thai', 'latin'],
    variable: '--font-sarabun'
})

export const metadata = {
    title: 'My Awesome Catalog',
    description: 'Product Catalog Template',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${sarabun.variable} font-sans bg-gray-50`}>
                {children}
            </body>
        </html>
    )
}
