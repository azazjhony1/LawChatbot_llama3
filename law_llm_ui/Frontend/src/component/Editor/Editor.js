import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import { RiSave3Line, RiCheckLine, RiDownload2Line, RiUpload2Line, RiHome2Line } from 'react-icons/ri';
import "react-quill/dist/quill.snow.css";
import "./styles.modules.css";
import { useNavigate } from "react-router-dom";


const Editor = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [editorValue, setEditorValue] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [error, setError] = useState(null);
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(""); // State to store document title

  const quill = useRef();

  useEffect(() => {
    const fetchDocument = async (documentId) => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found in local storage");
        return;
      }

      try {
        const response = await fetch(`http://192.168.0.114:8000/api/documents/${documentId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch document data");
        }

        const data = await response.json();
        setEditorValue(data.content || "");
        setDocumentTitle(data.title || ""); // Update document title from server
      } catch (error) {
        console.error("An error occurred while fetching the document:", error);
        setError("Failed to fetch document. Please try again later.");
      }
    };

    if (id) {
      fetchDocument(id);
    }
  }, [id]);

  const handler = () => {
    console.log(editorValue);
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const handleFinalize = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await fetch(`http://192.168.0.114:8000/api/documents/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          status: "final",
          content: editorValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to finalize document");
      }

      // Handle success response
      console.log("Document finalized successfully");
      setIsDocumentUpdated(true);

    } catch (error) {
      console.error("An error occurred while finalizing the document:", error);
      setError("Failed to finalize document. Please try again later.");
    }
  };

  const handleGenerate = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await fetch(`http://192.168.0.114:8000/api/documents/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          status: "draft",
          content: editorValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      // Handle success response
      console.log("Document updated successfully for generating");
      setIsPopupOpen(true);

    } catch (error) {
      console.error("An error occurred while updating the document for generating:", error);
      setError("Failed to update document for generating. Please try again later.");
    }
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  return (
    <div className="my-editor">
      {error && <div className="text-red-500 text-lg">{error}</div>}
      <div className="header flex justify-between items-center">
        <h1 className="header-title">{documentTitle}</h1>
  <div className="flex space-x-4 items-center">
  <div className="bg-green-500 p-2 rounded-full cursor-pointer">
    <RiSave3Line className="h-6 w-6 text-white" title="Save" />
  </div>
  <div className="bg-green-500 p-2 rounded-full cursor-pointer">
    <RiCheckLine className="h-6 w-6 text-white" title="Approve" />
  </div>
  <div className="bg-green-500 p-2 rounded-full cursor-pointer">
    <RiUpload2Line className="h-6 w-6 text-white" title="Import" />
  </div>
  <div className="bg-green-500 p-2 rounded-full cursor-pointer">
    <RiDownload2Line className="h-6 w-6 text-white" title="Export" />
  </div>
  <div className="bg-green-500 p-2 rounded-full cursor-pointer">
    <RiHome2Line className="h-6 w-6 text-white" onClick={() => navigate("/Dashboard")} title="Home" />
  </div>
</div>

</div>


      <div className="content">
        <div className="user-prompt">
          <div className="user-prompt-header">
            <h1 className="user-prompt-title">LAW-LLM</h1>
          </div>
          <p className="user-prompt-description text-bold">Request:</p>

          <textarea
            id="prompt"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            rows="10"
            className="user-prompt-textarea ql-editor"
            placeholder="Enter your prompt here..."
          ></textarea>
          <div className="user-prompt-buttons">
            <button className="generate-button" onClick={handleGenerate}>
              Generate
            </button>
            <button className="cancel-button">Cancel</button>
          </div>
        </div>
        <div className="editor-container">
          <ReactQuill
            ref={(el) => (quill.current = el)}
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
            formats={formats}
            modules={modules}
          />
        </div>
      </div>
      {isDocumentUpdated && (
        <div className="popup">
          <div className="popup-content">
            <p>Document updated successfully</p>
            <button onClick={() => setIsDocumentUpdated(false)}>OK</button>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <p>Content Generated</p>
            <button onClick={() => setIsPopupOpen(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
