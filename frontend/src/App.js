import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      setPrediction("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setPrediction("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8000/predict", formData);
      const result = response.data;
      setPrediction(`${result.class} (Confidence: ${(result.confidence * 100).toFixed(2)}%)`);
    } catch (error) {
      setPrediction("❌ Error: Unable to get prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌿 Pea Plant Disease Detector</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.fileInput}
        />

        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
        )}

        <button onClick={handleUpload} style={styles.button}>
          🔍 Predict
        </button>

        {loading && <p style={styles.loading}>⏳ Analyzing image...</p>}

        {prediction && (
          <div style={styles.resultBox}>
            <strong>Result:</strong> {prediction}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f0f4f8",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    color: "#2e7d32",
  },
  fileInput: {
    marginBottom: "1rem",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
    cursor: "pointer",
  },
  imagePreview: {
    margin: "1rem 0",
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "12px",
    border: "2px solid #e0e0e0",
  },
  button: {
    background: "#2e7d32",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  loading: {
    marginTop: "1rem",
    color: "#555",
  },
  resultBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#e8f5e9",
    borderRadius: "10px",
    color: "#1b5e20",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default App;


// ---------------------------------------------------------------------------------------------------------------------

// import { ImageUpload } from "./home.js";

// function App() {
//   return <ImageUpload />;
// }

// export default App;

// -----------------------------------------------------------------------------------------------------------------


// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);

//     if (file) {
//       const previewURL = URL.createObjectURL(file);
//       setImagePreview(previewURL);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;
//     setLoading(true);
//     setPrediction("");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await axios.post("http://localhost:8000/predict", formData);
//       const result = response.data;
//       setPrediction(`${result.class} (Confidence: ${(result.confidence * 100).toFixed(2)}%)`);
//     } catch (error) {
//       setPrediction("Error: Unable to get prediction.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
//       <h2>Pea Plant Disease Detection</h2>
//       <input type="file" onChange={handleFileChange} />
//       <br /><br />
//       {imagePreview && (
//         <img
//           src={imagePreview}
//           alt="Preview"
//           style={{ maxHeight: '200px', margin: '10px 0', borderRadius: '10px' }}
//         />
//       )}
//       <button onClick={handleUpload} style={{ padding: "10px 20px", cursor: "pointer" }}>
//         Predict
//       </button>

//       {loading && <p>Loading prediction...</p>}

//       {/* {prediction && (
//         <div style={{ backgroundColor: '#f0f0f0', padding: '1em', borderRadius: '10px', marginTop: '1rem' }}>
//           <strong>Disease:</strong> {prediction}
//         </div>
//       )} */}

//     {prediction && (
//     <div style={{ 
//       marginTop: "20px", 
//       padding: "10px", 
//       borderRadius: "8px", 
//       backgroundColor: "#e0f7fa", 
//       color: "#00796b", 
//       fontWeight: "bold" 
//     }}>
//       {prediction}
//     </div>
// )}

//     </div>
//   );
// }

// export default App;
