import React, { useState, useEffect, useCallback } from "react";
import { Space, Table, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePage } from "../contexts/PageContext";
import FormDialog from "./FormDialog";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
interface DataType {
  _id: number;
  key: React.ReactNode;
  parentId: number | null;
  path: string | null;
  name: string;
  fullPath: string | null;
  children?: DataType[];
}

export default function TreeDataGrid({ searchTerm }: { searchTerm: string }) {
  const {
    tabs,
    deleteTab,
  } = usePage();
  const [rows, setRows] = useState<DataType[]>([]);

  const deleteUser = useCallback(
    (id: number) => async () => {
      try {
        await deleteTab(id);
        setRows((prevRows) => prevRows.filter((row) => row.key !== id));
      } catch (error) {
        console.error("Error deleting tab", error);
      }
    },
    [deleteTab]
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Parent",
      dataIndex: "parentId",
      key: "parentName",
      width: "12%",
      render: (parentId: number | null) => {
        const parent = tabs?.find((tab) => tab._id === parentId);
        return parent?.name || ""; // Display "No Parent" if parent not found
      },
    },
    {
      title: "Path",
      dataIndex: "path",
      width: "30%",
      key: "path",
    },
    {
      title: "Full Path",
      dataIndex: "fullPath",
      width: "30%",
      key: "fullPath",
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: (_, record: DataType) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <FormDialog editMode={true} initialData={record} />
          <Popconfirm
            title={
              record.children && record.children.length > 0
                ? `${record.name} has sub-tabs. Are you sure you want to delete?`
                : "Are you sure you want to delete this tab?"
            }
            onConfirm={deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <IconButton aria-label="edit" color="primary">
              <DeleteIcon sx={{ color: "#d11a2a" }} />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const searchIncludes = (str: string) => str.toLowerCase().includes(searchTerm.toLowerCase());

  const createTreeData = (flatData: any) => {
    const findChildren = (parentId: number | null) => {
      return flatData
      .filter((row: any) => row.parentId === parentId)
        .map((row:any) => {
          const children = findChildren(row._id);
          return { ...row, children: children.length > 0 ? children : undefined };
        });
    };
    
    return findChildren(0);
  };
  const createFilteredTreeData = (flatData: any) => {
    const findChildren = (parentId: number | null) => {
      return flatData
        .filter((row: any) => row.parentId === parentId)
        .map((row:any) => {
          const children = findChildren(row._id);
          return { ...row, children: children.length > 0 ? children : undefined };
        });
    };
  
    const treeData = findChildren(0);
  
    const filterTree = (node: any) => {
      return (
        searchIncludes(node.name) ||
        searchIncludes(node.path) ||
        searchIncludes(node.fullPath) ||
        (node.children && node.children.some(filterTree))
      );
    };
  
    return treeData.filter(filterTree);
  };
  
  useEffect(() => {
    if (tabs) {
      const flatData = tabs.map((tab) => ({
        ...tab,
        key: tab._id,
        isParent: tab.parentId === 0,
      }));
      const filteredTreeData = createFilteredTreeData(flatData);
      setRows(filteredTreeData);
    }
  }, [tabs, searchTerm]);

  useEffect(() => {
    if (tabs) {
      const flatData = tabs.map((tab) => ({
        ...tab,
        key: tab._id,
        isParent: tab.parentId === 0,
      }));
      const treeData = createTreeData(flatData);
      setRows(treeData);
    }
  }, [tabs]);
  


  return (
    <>
      <Space align="center" style={{ marginBottom: 16 }}></Space>
      <Table
        pagination={{
          current: 1,
          pageSize: 10,
          total: 5,
        }}
        columns={columns}
        dataSource={rows}
      />
    </>
  );
}