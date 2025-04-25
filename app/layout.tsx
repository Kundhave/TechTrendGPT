import "./global.css";
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "TechTrendGPT",
    description: "The place to go for all recent tech news"
};

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
};

export default RootLayout;