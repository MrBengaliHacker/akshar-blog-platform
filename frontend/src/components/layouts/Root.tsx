// Components
import { Loading } from '@/components/Loading';

export const RootLayout = () => {
    return (
        <div className='flex flex-col min-h-dvh'>
            <Loading className='z-40' />
        </div>
    );
};