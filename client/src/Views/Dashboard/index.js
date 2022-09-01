import { useContext, useEffect } from "react";
import { SiteContext } from "SiteContext";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Tabs } from "Components/elements";
import Settings from "./Settings";
import { paths, endpoints } from "config";
import { useFetch } from "hooks";

import { FaPowerOff } from "react-icons/fa";

import s from "./dashboard.module.scss";

import Customers from "./Customers";
import Bills from "./Bills";

const Dashboard = () => {
  const { user, setUser, setConfig } = useContext(SiteContext);
  const navigate = useNavigate();

  const { post: logout } = useFetch(endpoints.logout);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, []);
  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.siteName}>
          <div className={`flex gap-1 align-center`}>
            <img className={s.logo} src="/favicon.ico" />
            <Link to={paths.customers}>Customers</Link>
            <Link to={paths.settings.baseUrl}>Settings</Link>
          </div>
        </div>
        <button
          className={`clear ${s.logoutBtn}`}
          title="Log out"
          onClick={() => {
            logout().then(({ data }) => {
              if (data.success) {
                setUser(null);
                setConfig(null);
                sessionStorage.removeItem("access_token");
              }
            });
          }}
        >
          <FaPowerOff />
        </button>
      </div>
      {
        //   <div className={s.tabs}>
        //   <Tabs
        //     className={s.tab}
        //     tabs={[
        //       { label: "Customers", path: paths.customers },
        //       { label: "Settings", path: paths.settings.baseUrl },
        //     ]}
        //   />
        // </div>
      }
      <Routes>
        <Route path={paths.customers} element={<Customers />} />
        <Route path={paths.bills} element={<Bills />} />
        <Route path={paths.settings.baseUrl} element={<Settings />} />
      </Routes>
      <footer>
        © {new Date().getFullYear()} Knave Kaiser Lab Works, All Rights
        Reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
