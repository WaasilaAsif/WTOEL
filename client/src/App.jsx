import { AppProvider, useApp } from "./context/AppContext";
import { HomePage } from "./pages/HomePage";

function AppInner() {
  const { loading, error } = useApp();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#d8e9d6] text-slate-700">
        <p className="text-sm">Lighting the workspace...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#d8e9d6] text-center text-slate-700">
        <div>
          <h1 className="font-heading text-2xl">LumaTasks</h1>
          <p className="mt-2 text-sm">{error}</p>
          <p className="text-xs opacity-75">Start the backend server on port 4000.</p>
        </div>
      </main>
    );
  }

  return <HomePage />;
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
