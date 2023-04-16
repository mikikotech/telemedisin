import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import RouteNavigation from "./src/navigations/routeNavigation";

const App = () => {
  return (
    <Provider store={store} >
      <RouteNavigation />
    </Provider>
  )
}

export default App