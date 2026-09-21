// Components
import { Loading } from '@/components/Loading';
import { Header } from '@/components/Header';

export const RootLayout = () => {
    return (
        <div className='flex flex-col min-h-dvh'>
            <Loading className='z-40' />

            <Header />
        </div>
    );
};