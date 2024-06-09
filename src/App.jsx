import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate
} from "react-router-dom";
import Postman from "./modules/Postman";
import SqlFormatter from "./components/SqlFormat/SqlFormat";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const list = [
  {
    slug: "Api-Doc",
    title: "Api-Doc",
    panel: <Postman />,
    route: "api-doc",
  },
  // {
  //   slug: "Compare-text",
  //   title: "Compare-text",
  //   route: "compare-text",
  //   panel: <div>header</div>,
  // },
  {
    slug: "Format-sql",
    title: "Format-sql",
    route: "format-sql",
    panel: <SqlFormatter />,

  },
];
const route = window.location.hash.slice(2);
let defaultTab = list.findIndex(item => item.route === route);

const TabContent = () => {
  const navigate = useNavigate();

  const handleTabSelect = (index) => {
    const selectedTab = list[index];
    navigate(selectedTab.route);
  };

  return (
    <Tabs
      forceRenderTabPanel
      selectedTabClassName="border-b-2 text-orange-600"
      onSelect={handleTabSelect}
      defaultIndex={defaultTab}
    >
      <TabList className="flex border border-gray-300 rounded-t-lg">
        {list.map((tab) => (
          <Tab
            className="mr-3 py-2 px-4 border-orange-400 focus:outline-none hover:text-orange-500 cursor-pointer"
            key={tab.slug}
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>
      {list.map((tab) => (
        <TabPanel key={tab.slug}>{tab.panel}</TabPanel>
      ))}
    </Tabs>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={list[0].route} replace />} />
        <Route path="*" element={<TabContent />} />
      </Routes>
    </Router>
  );
};

export default App;
