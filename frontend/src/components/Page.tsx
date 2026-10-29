export const Page = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='pt-24 pb-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none'>
      {children}
    </div>
  );
};