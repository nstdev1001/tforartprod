import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import MaintenancePage from "./components/MaintenancePage";
import LoadingBar from "./config/loadingBar_config";
import { routerConfig } from "./config/route_config";
import ToasterConfig from "./config/toaster_config";
import { RouterProvider } from "react-router-dom";

function App() {
  const isMaintenanceMode = false;

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <ErrorBoundary>
      <LoadingBar />
      <ToasterConfig />
      <RouterProvider router={routerConfig} />
    </ErrorBoundary>
  );
}

export default App;
