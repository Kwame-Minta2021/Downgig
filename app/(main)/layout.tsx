import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    );
}
