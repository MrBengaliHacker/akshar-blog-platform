// Assets
import { Loader2Icon } from 'lucide-react';

// Shown while the first page is loading (HydrateFallback)
export const PageLoading = () => {
  return (
    <div className='h-dvh grid place-content-center'>
      <Loader2Icon
        className='size-8 animate-spin text-muted-foreground'
        aria-label='Loading'
      />
    </div>
  );
};