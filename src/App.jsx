import DatasetAnnotationPage from "./DatasetAnnotationPage";
import ValidatorDashboardPage from "./ValidatorDashboardPage";

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const hashRoute = hash.startsWith("#/") ? hash.slice(1) : "";

  if (
    path.startsWith("/validation") ||
    path.startsWith("/validator") ||
    hashRoute.startsWith("/validation") ||
    hashRoute.startsWith("/validator")
  ) {
    return <ValidatorDashboardPage />;
  }

  // Default to the dataset tool (also covers /dataset when hosted under that path).
  return <DatasetAnnotationPage />;
}
