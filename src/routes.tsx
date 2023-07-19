import { useRoutes } from "react-router-dom";
import Layout from "./layouts/Layout";
import AddPages from "./pages/AddPages";
import Pages from "./pages/Pages";

export const RouteList: React.FC = () => {
    return useRoutes([
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Pages />,
          },
          {
            path: "/add-pages",
            element: <AddPages />,
          },
        ],
      },
    ]);
  };