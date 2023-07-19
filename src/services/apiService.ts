import axios, { AxiosResponse } from "axios";

export async function fetchTabs(): Promise<AxiosResponse<any>> {
  return axios.get("https://localhost:7136/api/Tab/GetAllTabs");
}

export async function fetchSelectableParentTabs(
  id: number
): Promise<AxiosResponse<any>> {
  return axios.get(
    `https://localhost:7136/api/Tab/GetSelectableParentTabs?id=${id}`
  );
}
export async function addTabService(tabData: {
  tabName: string;
  parentName: string;
  fullPath: string;
  path: string;
}): Promise<AxiosResponse<any>> {
  return axios.post("https://localhost:7136/api/Tab/AddTab", tabData);
}

export async function deleteTabService(id: number): Promise<AxiosResponse<any>> {
  return axios.delete("https://localhost:7136/api/Tab/DeleteTab", {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      id: id
    }
  });
}

export async function updateTabService(tabData: {
  id: number;
  tabName: string;
  parentName: string;
  fullPath: string;
  path: string;
}): Promise<AxiosResponse<any>> {
  return axios.put('https://localhost:7136/api/Tab/UpdateTab', tabData);
}


