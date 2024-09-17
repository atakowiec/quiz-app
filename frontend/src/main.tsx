import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./store";
import { Provider } from "react-redux";
import { SocketProvider } from "./socket/SocketContext.tsx";
//import { DevSupport } from "@react-buddy/ide-toolbox";
//import { ComponentPreviews, useInitial } from "./dev";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        {/* <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        > */}
        <App />
        {/* </DevSupport> */}
      </SocketProvider>
    </Provider>
  </StrictMode>
);
