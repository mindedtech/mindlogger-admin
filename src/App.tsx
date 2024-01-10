import { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';

import { setupStore } from 'redux/store';
import { theme } from 'shared/styles';
import { Spinner } from 'shared/components';
import { AppRoutes } from 'routes';
import { ErrorFallback } from 'shared/components/ErrorFallback';
import svgBuilder from 'shared/utils/svgBuilder';

const App = () => {
  useEffect(() => {
    (async () => {
      const svgSprite = await import('svgSprite');
      document.body.appendChild(svgBuilder(svgSprite.default));
    })();
  }, []);

  return (
    <Provider store={setupStore()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Spinner />}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
