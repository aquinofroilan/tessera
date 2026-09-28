import { RouterProvider } from '@tanstack/react-router';
import { AppProvider } from './providers/AppProvider';
import { router } from './routes';

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
