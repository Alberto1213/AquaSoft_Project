// import React, { useEffect, useState } from "react";

// const Manager = () => {
//   const [hotels, setHotels] = useState([]);
//   const [error, setError] = useState("");
//   const [editingHotel, setEditingHotel] = useState(null);

//   const token = localStorage.getItem("token");

//   const fetchHotels = async () => {
//     try {
//       const res = await fetch("http://localhost:3001/hotels");
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch hotels");
//       setHotels(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleDelete = async (hotel) => {
//     try {
//       const res = await fetch(`http://localhost:3001/hotels/${hotel.GlobalPropertyID}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to delete hotel");
//       fetchHotels();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`http://localhost:3001/hotels/${editingHotel.GlobalPropertyID}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(editingHotel),
//       });
//       if (!res.ok) throw new Error("Failed to update hotel");
//       setEditingHotel(null);
//       fetchHotels();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h2>Manager Hoteluri</h2>
//       {error && <p style={styles.error}>{error}</p>}
//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th style={styles.cell}>Nume Hotel</th>
//             <th style={styles.cell}>Adresă</th>
//             <th style={styles.cell}>Oraș</th>
//             <th style={styles.cell}>Țară</th>
//             <th style={styles.cell}>Scor</th>
//             <th style={styles.cell}>Acțiuni</th>
//           </tr>
//         </thead>
//         <tbody>
//           {hotels.map((hotel) => (
//             <tr key={hotel.GlobalPropertyID}>
//               <td style={styles.cell}>{hotel.GlobalPropertyName}</td>
//               <td style={styles.cell}>{`${hotel.PropertyAddress1 || ""} ${hotel.PropertyAddress2 || ""}`}</td>
//               <td style={styles.cell}>{hotel.city?.CityName?.toUpperCase() || "-"}</td>
//               <td style={styles.cell}>{hotel.city?.Country || "-"}</td>
//               <td style={styles.cell}>{hotel.CalculatedScore?.score || "-"}</td>
//               <td style={styles.cell}>
//                 <button style={styles.btnEdit} onClick={() => setEditingHotel(hotel)}>Edit</button>
//                 <button style={styles.btnDelete} onClick={() => handleDelete(hotel)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {editingHotel && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <h3>Editare Hotel</h3>
//             <label>
//               Nume:
//               <input
//                 type="text"
//                 value={editingHotel.GlobalPropertyName}
//                 onChange={(e) =>
//                   setEditingHotel({ ...editingHotel, GlobalPropertyName: e.target.value })
//                 }
//               />
//             </label>
//             <label>
//               Adresă 1:
//               <input
//                 type="text"
//                 value={editingHotel.PropertyAddress1 || ""}
//                 onChange={(e) =>
//                   setEditingHotel({ ...editingHotel, PropertyAddress1: e.target.value })
//                 }
//               />
//             </label>
//             <label>
//               Oraș:
//               <input
//                 type="text"
//                 value={editingHotel.city?.CityName || ""}
//                 onChange={(e) =>
//                   setEditingHotel({
//                     ...editingHotel,
//                     city: { ...editingHotel.city, CityName: e.target.value },
//                   })
//                 }
//               />
//             </label>
//             <label>
//               Țară:
//               <input
//                 type="text"
//                 value={editingHotel.city?.Country || ""}
//                 onChange={(e) =>
//                   setEditingHotel({
//                     ...editingHotel,
//                     city: { ...editingHotel.city, Country: e.target.value },
//                   })
//                 }
//               />
//             </label>
//             <div style={{ marginTop: 10 }}>
//               <button onClick={handleUpdate} style={styles.btnSave}>Salvează</button>
//               <button onClick={() => setEditingHotel(null)} style={styles.btnCancel}>Anulează</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: 900,
//     margin: "40px auto",
//     padding: 20,
//     fontFamily: "Arial, sans-serif",
//   },
//   error: {
//     color: "red",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     border: "2px solid #444",
//   },
//   cell: {
//     border: "1px solid #444",
//     padding: 12,
//     textAlign: "center",
//   },
//   btnEdit: {
//     marginRight: 5,
//     backgroundColor: "#ffc107",
//     border: "none",
//     padding: "6px 12px",
//     color: "#000",
//     cursor: "pointer",
//     borderRadius: 4,
//   },
//   btnDelete: {
//     backgroundColor: "#dc3545",
//     border: "none",
//     padding: "6px 12px",
//     color: "#fff",
//     cursor: "pointer",
//     borderRadius: 4,
//   },
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modal: {
//     background: "#fff",
//     padding: 20,
//     borderRadius: 8,
//     width: 400,
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   btnSave: {
//     backgroundColor: "#28a745",
//     border: "none",
//     padding: "6px 12px",
//     color: "#fff",
//     cursor: "pointer",
//     marginRight: 10,
//     borderRadius: 4,
//   },
//   btnCancel: {
//     backgroundColor: "#6c757d",
//     border: "none",
//     padding: "6px 12px",
//     color: "#fff",
//     cursor: "pointer",
//     borderRadius: 4,
//   },
// };

// export default Manager;


import React, { useEffect, useState } from "react";
import "./HotelsTable.css";
import "./Manager.css";

const Manager = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [editingHotel, setEditingHotel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:3001/hotels");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch hotels");
      setHotels(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3001/hotels/${editingHotel.GlobalPropertyID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingHotel),
      });
      if (!res.ok) throw new Error("Failed to update hotel");
      setEditingHotel(null);
      fetchHotels();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Paginație:
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = hotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  return (
    <div className="hotels-container">
      <h2 className="hotels-title">Manager Hoteluri</h2>
      {error && <p className="hotels-error">{error}</p>}

      <div className="hotels-table-wrapper">
        <table className="hotels-table">
          <thead>
            <tr>
              <th>Nume Hotel</th>
              <th>Adresă</th>
              <th>Oraș</th>
              <th>Țară</th>
              <th>Scor</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {currentHotels.map((hotel) => (
              <tr key={hotel.GlobalPropertyID}>
                <td>{hotel.GlobalPropertyName}</td>
                <td>{`${hotel.PropertyAddress1 || ""} ${hotel.PropertyAddress2 || ""}`}</td>
                <td>{hotel.city?.CityName?.toUpperCase() || "-"}</td>
                <td>{hotel.city?.Country || "-"}</td>
                <td>{hotel.CalculatedScore?.score || "-"}</td>
                <td>
                  <button
                    className="hotels-btn"
                    onClick={() => setEditingHotel(hotel)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginare */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>

      {/* Modal editare */}
      {editingHotel && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editare Hotel</h3>
            <label>
              Nume:
              <input
                type="text"
                value={editingHotel.GlobalPropertyName}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, GlobalPropertyName: e.target.value })
                }
              />
            </label>
            <label>
              Adresă 1:
              <input
                type="text"
                value={editingHotel.PropertyAddress1 || ""}
                onChange={(e) =>
                  setEditingHotel({ ...editingHotel, PropertyAddress1: e.target.value })
                }
              />
            </label>
            <label>
              Oraș:
              <input
                type="text"
                value={editingHotel.city?.CityName || ""}
                onChange={(e) =>
                  setEditingHotel({
                    ...editingHotel,
                    city: { ...editingHotel.city, CityName: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Țară:
              <input
                type="text"
                value={editingHotel.city?.Country || ""}
                onChange={(e) =>
                  setEditingHotel({
                    ...editingHotel,
                    city: { ...editingHotel.city, Country: e.target.value },
                  })
                }
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handleUpdate} className="btn-save">
                Salvează
              </button>
              <button onClick={() => setEditingHotel(null)} className="btn-cancel">
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
