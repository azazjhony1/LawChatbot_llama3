import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { marked } from "marked";

const MyEditor = () => {
  const [prompt, setPrompt] = useState("");
  const [editorData, setEditorData] = useState("");

  // Sample markdown data with various markdown syntaxes
  const markdownData = `
  # Sample Form
  # Section 1
  **Question 1:** Describe your experience with React.
  - **Question 2:** How do you manage state in React applications?
  
  **Section 2**
  - **Question 1:** What are your thoughts on server-side rendering?
  - **Question 2:** Explain the difference between CSS-in-JS and traditional CSS.

  ### Table Example
  | Syntax | Description |
  | ----------- | ----------- |
  | **Bold** | This is **bold** text |
  | *Italic* | This is *italic* text |
  | \`Code\` | This is \`inline code\` |
  `;

  // Convert markdown to HTML and set it as initial editor data
  useEffect(() => {
    const htmlData = marked(markdownData);
    setEditorData(htmlData);
  }, []);

  const handleGenerate = () => {
    console.log("Generate button clicked with prompt:", prompt);
    // Add your generate logic here
  };

  return (
    <div className="MyEditor p-6 bg-gray-50 min-h-screen">
      <div className="bg-purple-500 flex justify-center items-center pb-3 pt-3">
        <h1 className="text-3xl font-bold text-white">Forms Editor</h1>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white p-6 shadow-lg rounded-lg">
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onReady={(editor) => {
              console.log("CKEditor5 React Component is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({ event, editor, data });
            }}
          />
        </div>
        <div className="col-span-4 bg-white p-6 shadow-lg rounded-lg">
          <div className="mb-4">
            <div className="bg-purple-500 flex justify-center items-center pb-3 pt-3">
              <h1 className="text-2xl font-bold text-white">User Prompt</h1>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="10"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your prompt here..."
            ></textarea>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyEditor;
