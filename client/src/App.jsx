import AppRouter from "./routes";
import setupInterceptors from "./api/interceptor";

setupInterceptors();
function App() {
  return <AppRouter />;
}

export default App;
