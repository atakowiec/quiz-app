import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store";
import { Provider } from "react-redux";
import { SocketProvider } from "./socket/SocketContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import AppWrapper from "./components/AppWrapper.tsx";
import { ReloadApiProvider } from "./api/ReloadApiContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ReloadApiProvider>
          <AppWrapper>
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </AppWrapper>
        </ReloadApiProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </SocketProvider>
    </Provider>
  </StrictMode>
);
