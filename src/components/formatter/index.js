// CompareText.js
import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";
import "./Format.css";

const options = [
  { value: "sql", label: "Standard SQL" },
  { value: "bigquery", label: "GCP BigQuery" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "db2", label: "IBM DB2" },
  { value: "db2i", label: "IBM DB2i (experimental)" },
  { value: "hive", label: "Apache Hive" },
  { value: "singlestoredb", label: "SingleStoreDB" },
  { value: "mariadb", label: "MariaDB" },
  { value: "mysql", label: "MySQL" },
  { value: "plsql", label: "Oracle PL/SQL" },
  { value: "n1ql", label: "Couchbase N1QL" },
  { value: "Amazon Redshift", label: "Amazon Redshift" },
  { value: "snowflake", label: "Snowflake" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server Transact-SQL" },
  { value: "tsql", label: "SQL Server Transact-SQL" },
  { value: "trino", label: "Trino" },
];

const Formatter = () => {
  const editorRef = useRef(null);
  const [inputData, setInputData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [selectedOption, setSelectedOption] = useState("postgresql");

  function handleEditorDidMount(editor, monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }

  const formatData = () => {
    setFormattedData(
      format(inputData, {
        language: selectedOption,
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      })
    );
  };

  const changedData = (data) => {
    setInputData(data);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value || "postgresql");
  };

  return (
    <>
      <div className="format-type">
        <select
          className="select"
          id="mySelect"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="">-- Select --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="button" onClick={formatData}>
          Format
        </button>
      </div>
      <div className="flex">
        <Editor
          className="border"
          height="85vh"
          defaultLanguage="sql"
          defaultValue=""
          onMount={handleEditorDidMount}
          onChange={changedData}
        />
        <Editor
          className="border"
          height="85vh"
          defaultLanguage="sql"
          value={formattedData}
          onMount={handleEditorDidMount}
        />
      </div>
    </>
  );
};

export default Formatter;
