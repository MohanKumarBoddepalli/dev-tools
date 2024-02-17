// CompareText.js
import React, { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import "./Compare.css";

const CompareText = () => {
  const [originalValue, setOriginalValue] = useState("");
  const [referenceValue, setReferenceValue] = useState("");

  return (
    <>
      <div className="margin">
        {
          <div>
            <DiffEditor
              height="62vh"
              language="javascript"
              theme="vs-dark"
              original={originalValue}
              modified={referenceValue}
            />
          </div>
        }
        <div className="center"></div>
        <div className="text_wrapper">
          <textarea
            placeholder="Enter actual value..."
            className="textArea"
            onChange={(e) => setOriginalValue(e.target.value)}
          ></textarea>
          <textarea
            placeholder="Enter diff value..."
            className="textArea"
            onChange={(e) => setReferenceValue(e.target.value)}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default CompareText;
