// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const HotelsTable = () => {
//   const [hotels, setHotels] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const fetchHotels = async () => {
//     try {
//       const res = await fetch("http://localhost:3001/hotels");
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch hotels");
//       setHotels(data);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h2>Lista hotelurilor</h2>
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
//               <td style={styles.cell}>
//                 <Link to={`/hotel/${hotel.GlobalPropertyID}`} style={styles.link}>
//                   {hotel.GlobalPropertyName}
//                 </Link>
//               </td>
//               <td style={styles.cell}>{`${hotel.PropertyAddress1 || ""} ${hotel.PropertyAddress2 || ""}`.trim()}</td>
//               <td style={styles.cell}>{(hotel.city?.CityName || "-").toUpperCase()}</td>
//               <td style={styles.cell}>{hotel.city?.Country || "-"}</td>
//               <td style={styles.cell}>{hotel.CalculatedScore?.score || "-"}</td>
//               <td style={styles.cell}>
//                 <button
//                   style={styles.btnDetails}
//                   onClick={() => navigate(`/hotels/${hotel.GlobalPropertyID}`)}
//                 >
//                   Detalii
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
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
//     verticalAlign: "middle",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//     cursor: "pointer",
//   },
//   btnDetails: {
//     padding: "6px 12px",
//     backgroundColor: "#007bff",
//     border: "none",
//     color: "white",
//     borderRadius: 4,
//     cursor: "pointer",
//   },
// };

// export default HotelsTable;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HotelsTable.css";

const HotelsTable = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 5; // câte hoteluri afișăm pe pagină
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:3001/hotels");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch hotels");
        setHotels(data);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    };
    fetchHotels();
  }, []);

  // Calculăm hotelurile pentru pagina curentă
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  // Numărul total de pagini
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  // Funcții pentru schimbarea paginii
  const goToPage = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    else if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="hotels-container">
      <h2 className="hotels-title">Lista hotelurilor</h2>
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
            {currentHotels.length > 0 ? (
              currentHotels.map((hotel) => (
                <tr key={hotel.GlobalPropertyID || hotel.id || hotel._id}>
                  <td>
                    <Link to={`/hotel/${hotel.GlobalPropertyID}`} className="hotels-link">
                      {hotel.GlobalPropertyName || "Nume necunoscut"}
                    </Link>
                  </td>
                  <td>{`${hotel.PropertyAddress1 || ""} ${hotel.PropertyAddress2 || ""}`.trim()}</td>
                  <td>{(hotel.city?.CityName || "-").toUpperCase()}</td>
                  <td>{hotel.city?.Country || "-"}</td>
                  <td>{hotel.CalculatedScore?.score || "-"}</td>
                  <td>
                    <button
                      className="hotels-btn"
                      onClick={() => navigate(`/hotels/${hotel.GlobalPropertyID}`)}
                    >
                      Detalii
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Nu există hoteluri de afișat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controalele paginării */}
      {hotels.length > hotelsPerPage && (
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            &lt; Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={page === currentPage ? "active" : ""}
              >
                {page}
              </button>
            );
          })}

          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelsTable;
