import React, { useRef, useState, useEffect } from "react";
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
  const [inputData, setInputData] = useState(sessionStorage.getItem("sql"));
  const [formattedData, setFormattedData] = useState(
    sessionStorage.getItem("FormattedSql")
  );
  const [selectedOption, setSelectedOption] = useState("postgresql");

  useEffect(() => {
    const storedOption = sessionStorage.getItem("sqlOption");
    setSelectedOption(storedOption || "postgresql");
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const formatData = () => {
    const formatted = format(inputData, {
      language: selectedOption,
      tabWidth: 2,
      keywordCase: "upper",
      linesBetweenQueries: 2,
    });
    setFormattedData(formatted);
    sessionStorage.setItem("FormattedSql", formatted);
    sessionStorage.setItem("sql", inputData);
  };

  const changedData = (data) => {
    setInputData(data || "");
    sessionStorage.setItem("sql", data || "");
  };

  const handleSelectChange = (event) => {
    const value = event.target.value || "postgresql";
    setSelectedOption(value);
    sessionStorage.setItem("sqlOption", value);
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
          theme="vs-dark"
          defaultLanguage="sql"
          defaultValue={inputData}
          onMount={handleEditorDidMount}
          onChange={changedData}
        />
        <Editor
          className="border"
          height="85vh"
          theme="vs-dark"
          defaultLanguage="sql"
          value={formattedData}
          onMount={handleEditorDidMount}
        />
      </div>
    </>
  );
};

export default Formatter;
