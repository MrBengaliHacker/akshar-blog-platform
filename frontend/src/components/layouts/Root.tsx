import { Outlet } from 'react-router';

// Components
import { Loading } from '@/components/Loading';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';

export const RootLayout = () => {
    return (
        <TooltipProvider>
            <div className='flex flex-col min-h-dvh'>
                <Loading className='z-40' />

                <Header />

                <main className="grow flex flex-col">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </TooltipProvider>
    );
};