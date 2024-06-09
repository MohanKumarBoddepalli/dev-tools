import React, { useState, useEffect, useRef } from 'react';
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { format } from 'sql-formatter';

const SqlFormatter = () => {
  const leftEditorRef = useRef(null);
  const rightEditorRef = useRef(null);
  const [formattedSql, setFormattedSql] = useState('');

  useEffect(() => {
    const leftEditor = new EditorView({
      state: EditorState.create({
        doc: '',
        extensions: [
          basicSetup,
          keymap.of(defaultKeymap),
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              const sql = update.state.doc.toString();
              setFormattedSql(format(sql));
            }
          })
        ]
      }),
      parent: leftEditorRef.current
    });

    return () => {
      leftEditor.destroy();
    };
  }, []);

  useEffect(() => {
    const rightEditor = new EditorView({
      state: EditorState.create({
        doc: formattedSql,
        extensions: [
          basicSetup,
          EditorView.editable.of(false) // Set the editor to read-only
        ]
      }),
      parent: rightEditorRef.current
    });

    return () => {
      rightEditor.destroy();
    };
  }, [formattedSql]);

  return (
    <div className="flex flex-col h-full">  
      <div className="flex-grow grid grid-cols-2 h-full">
        <div className="col-span-1 h-full border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-12 bg-gray-50">
              <span className="text-2xl font-medium">SQL</span>
            </div>
            <div ref={leftEditorRef} className="flex-grow overflow-auto h-screen" style={{ border: '1px solid #ddd' }}></div>
          </div>
        </div>
        <div className="col-span-1 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-12 bg-gray-50">
              <span className="text-2xl font-medium">Result</span>
            </div>
            <div ref={rightEditorRef} className="flex-grow overflow-auto h-screen" style={{ border: '1px solid #ddd' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlFormatter;
