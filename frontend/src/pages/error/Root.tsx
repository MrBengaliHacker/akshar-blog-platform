import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router';

// Components
import { Button } from '@/components/ui/button';

type ErrorScreenProps = {
  title: string;
  message: string;
  details?: string;
};

const ErrorScreen = ({ title, message, details }: ErrorScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className='h-dvh grid place-content-center place-items-center gap-4 px-4'>
      <h1 className='text-4xl font-semibold text-center'>{title}</h1>

      <p className='text-muted-foreground max-w-[60ch] text-center text-balance'>
        {message}
      </p>

      <div className='flex gap-3'>
        <Button
          variant='outline'
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>

        <Button onClick={() => navigate('/')}>Go home</Button>
      </div>

      {/* The technical details are shown only while developing */}
      {details && (
        <pre className='max-w-[80ch] max-h-60 overflow-auto text-xs text-muted-foreground'>
          {details}
        </pre>
      )}
    </div>
  );
};

export const RootErrorBoundary = () => {
  const error = useRouteError();
  const location = useLocation();

  if (isRouteErrorResponse(error)) {
    // error.data can be a text or an object, so check it before using it
    const message =
      typeof error.data === 'string' && error.data
        ? error.data
        : error.statusText;

    if (error.status === 401 && message.includes('token expired')) {
      return (
        <Navigate
          to={`/refresh-token?redirect=${location.pathname}`}
        />
      );
    }

    return (
      <ErrorScreen
        title={`${error.status} ${error.statusText}`}
        message={message}
      />
    );
  }

  if (error instanceof Error) {
    return (
      <ErrorScreen
        title='Something went wrong'
        message='Please try again, or go back to the home page.'
        details={import.meta.env.DEV ? `${error.message}\n\n${error.stack}` : undefined}
      />
    );
  }

  return (
    <ErrorScreen
      title='Something went wrong'
      message='Please try again, or go back to the home page.'
    />
  );
};