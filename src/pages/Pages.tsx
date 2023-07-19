import React, { useState } from "react";
import FormDialog from "../components/FormDialog";
import TreeDataGrid from "../components/AntDesignTable";
import SearchAppBar from "../components/Search";

const Pages = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div style={{ marginTop: 20, marginRight: 80, marginLeft: 80 }}>
        <div style={{ marginTop: 20, marginLeft: 1100 }}><SearchAppBar onSearch={setSearchTerm} /> </div>
        
        <TreeDataGrid searchTerm={searchTerm} />
        <br />
        <div style={{ marginBottom:20}}> <FormDialog
          editMode={false}
        /></div>
      </div>
    </div>
  );
};

export default Pages;
