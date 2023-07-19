import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchTabs,
  fetchSelectableParentTabs,
  addTabService,
  deleteTabService,
  updateTabService
} from "../services/apiService";

interface ITab {
  _id: number;
  parentId: number ;
  path: string ;
  name: string;
  fullPath: string ;
}

interface ISelectableTab {
  _id: number;
  name: string;
}

interface IContext {
  tabs: ITab[] | undefined;
  selectableTabs: ISelectableTab[] | undefined;
  selectableTabOptions: string[];
  loading: boolean;
  succeeded : boolean;
  fetchSelectableTabs: (id: number) => Promise<void>;
  addTab: (tabData: {
    tabName: string;
    parentName: string;
    fullPath: string;
    path: string;
  }) => Promise<void>;
  deleteTab: (id: number) => Promise<void>;
  updateTab: (tabData: {
    id: number;
    tabName: string;
    parentName: string;
    fullPath: string;
    path: string;
  }) => Promise<void>;
}

const PageContext = createContext<IContext | undefined>(undefined);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tabs, setTabs] = useState<ITab[] | undefined>(undefined);
  const [selectableTabs, setSelectableTabs] = useState<
    ISelectableTab[] | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectableTabOptions, setSelectableTabOptions] = useState<string[]>(
    []
  );
  const [succeeded, setSucceeded] = useState<boolean>(false);;


  useEffect(() => {
    fetchTabs()
      .then((response) => {
        setTabs(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tabs", error);
        setLoading(false);
      });
  }, []);

  const fetchSelectableTabs = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetchSelectableParentTabs(id);
      setSelectableTabs(response.data.data);
      setSelectableTabOptions(
        response.data.data.map((tab: ISelectableTab) => tab.name)
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching selectable tabs", error);
      setLoading(false);
    }
  };

  const addTab = async (tabData: {
    tabName: string;
    parentName: string;
    fullPath: string;
    path: string;
  }) => {
    try {
      setLoading(true);
      await addTabService(tabData);
      // Verinin düzgün bir şekilde gönderildiğini varsayarak, mevcut tab listesini güncelleyelim
      const response = await fetchTabs();
      setTabs(response.data.data);
      setSucceeded(response.data.succeeded);
      console.log("asdff",response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error adding new tab", error);
      setSucceeded(false);
      setLoading(false);
    }finally {
      
      setLoading(false);
    }
  };
  const deleteTab = async (id: number) => {
    try {
      setLoading(true);
      await deleteTabService(id);
      // Silme işleminin başarılı olduğunu varsayarak, mevcut tab listesini güncelleyelim
      const response = await fetchTabs();
      setTabs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting tab", error);
      setLoading(false);
    }
  };

  const updateTab = async (tabData: {
    id: number;
    tabName: string;
    parentName: string;
    fullPath: string;
    path: string;
  }) => {
    try {
      setLoading(true);
      await updateTabService(tabData);
      // Assuming the data is successfully updated, update the current tab list
      const response = await fetchTabs();
      setTabs(response.data.data);
      setSucceeded(response.data.succeeded);
      setLoading(false);
    } catch (error) {
      console.error("Error updating tab", error);
      setLoading(false);
      setSucceeded(false);
    }
  };

  return (
    <PageContext.Provider
      value={{
        tabs,
        selectableTabs,
        selectableTabOptions,
        loading,
        fetchSelectableTabs,
        addTab,
        deleteTab,
        updateTab,
        succeeded,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};
