import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";

import routesConfig from "./data/routesConfig.ts";
import { PrivilegeLevel } from "./data/routesConfig.ts";

function App() {
  const userPrivilegeLevel: PrivilegeLevel = PrivilegeLevel.Admin;
  // Replace with actual logic to determine privilege level: AUTHORISATION

  return (
    <div className="App h-screen w-screen grid place-items-center text-5xl">
      <Routes>
        <Route index element={<Home renderedAs="index" />} />

        <Route path="app" element={<Home renderedAs="component" />}>
          {/* privileged routes: authenticated only */}
          {routesConfig[userPrivilegeLevel].map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Route>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="recovery" element={<ForgotPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}


export default App;