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
              height="92vh"
              language="text"
              original={originalValue}
              modified={referenceValue}
              options={{
                originalEditable: true,
                hideUnchangedRegions: {
                  enabled: true,
                  revealLineCount: 2,
                  minimumLineCount: 1,
                  contextLineCount: 3,
                },
                quickSuggestions: false,
                diffCodeLens: true,
              }}
            />
          </div>
        }
        <div className="center"></div>
      </div>
    </>
  );
};

export default CompareText;
