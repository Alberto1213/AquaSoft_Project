// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const HotelDetails = () => {
//   const { id } = useParams();
//   const [hotel, setHotel] = useState(null);
//   const [reviews, setReviews] = useState([]); // Stocăm review-urile separat
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const fetchHotelDetails = async () => {
//     try {
//       const res = await fetch(`http://localhost:3001/hotels/${id}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch hotel details");

//       setHotel({
//         ...data.hotel,
//         CalculatedScore: data.calculatedScore,
//       });

//       setReviews(data.reviews || []); // setăm review-urile

//       setError("");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchHotelDetails();
//   }, [id]);

//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//   if (!hotel) return <p>Se încarcă detaliile hotelului...</p>;

//   return (
//     <div style={styles.container}>
//       <h2>{hotel.GlobalPropertyName}</h2>
//       <p><strong>Adresă:</strong> {`${hotel.PropertyAddress1 || ""} ${hotel.PropertyAddress2 || ""}`.trim()}</p>
//       <p><strong>Telefon:</strong> {hotel.PropertyPhoneNumber || "N/A"}</p>
//       <p><strong>Fax:</strong> {hotel.PropertyFaxNumber || "N/A"}</p>
//       <p><strong>Rating Sabre:</strong> {hotel.SabrePropertyRating || "N/A"}</p>
//       <p><strong>Cod aeroport principal:</strong> {hotel.PrimaryAirportCode || "N/A"}</p>
//       <p><strong>Coordonate:</strong> {hotel.PropertyLatitude}, {hotel.PropertyLongitude}</p>
//       <p><strong>Scor calculat:</strong> {hotel.CalculatedScore?.score || "N/A"}</p>

//       <h3>Recenzii</h3>
//       {reviews.length === 0 ? (
//         <p>Nu există recenzii disponibile pentru acest hotel.</p>
//       ) : (
//         <ul style={styles.reviewList}>
//           {reviews.map((review) => (
//             <li key={review.ReviewID} style={styles.reviewItem}>
//               <h4>{review.Title} — Rating: {review.Rating}</h4>
//               <p><strong>Data călătoriei:</strong> {review.TravelDate}</p>
//               <p><strong>Număr nopți:</strong> {review.NumberOfNights}</p>
//               <p><strong>Tip cameră:</strong> {review.RoomType}</p>
//               <p><strong>Feedback pozitiv:</strong> {review.PositiveFeedback}</p>
//               {review.NegativeFeedback && (
//                 <p><strong>Feedback negativ:</strong> {review.NegativeFeedback}</p>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}

//       <button onClick={() => navigate(-1)} style={styles.btnBack}>⬅ Înapoi</button>
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
//   btnBack: {
//     marginTop: 20,
//     backgroundColor: "#6c757d",
//     color: "white",
//     border: "none",
//     padding: "10px 16px",
//     borderRadius: 6,
//     cursor: "pointer",
//   },
//   reviewList: {
//     listStyleType: "none",
//     paddingLeft: 0,
//   },
//   reviewItem: {
//     marginBottom: 20,
//     padding: 15,
//     border: "1px solid #ccc",
//     borderRadius: 6,
//     backgroundColor: "#f9f9f9",
//   },
// };

// export default HotelDetails;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HotelDetails.css";

const REVIEWS_PER_PAGE = 1;

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchHotelDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3001/hotels/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch hotel details");

      setHotel({
        ...data.hotel,
        CalculatedScore: data.calculatedScore,
      });

      setReviews(data.reviews || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (error) return <p className="error">{error}</p>;
  if (!hotel) return <p className="loading">Se încarcă detaliile hotelului...</p>;

  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  return (
    <div className="container">
      <h2>{hotel.GlobalPropertyName}</h2>
      <p><strong>Adresă:</strong> {`${hotel.PropertyAddress1 || ""} ${hotel.PropertyAddress2 || ""}`.trim()}</p>
      <p><strong>Telefon:</strong> {hotel.PropertyPhoneNumber || "N/A"}</p>
      <p><strong>Fax:</strong> {hotel.PropertyFaxNumber || "N/A"}</p>
      <p><strong>Rating Sabre:</strong> {hotel.SabrePropertyRating || "N/A"}</p>
      <p><strong>Cod aeroport principal:</strong> {hotel.PrimaryAirportCode || "N/A"}</p>
      <p><strong>Coordonate:</strong> {hotel.PropertyLatitude}, {hotel.PropertyLongitude}</p>
      <p><strong>Scor calculat:</strong> {hotel.CalculatedScore?.score || "N/A"}</p>

      <h3>Recenzii</h3>
      {reviews.length === 0 ? (
        <p>Nu există recenzii disponibile pentru acest hotel.</p>
      ) : (
        <>
          <ul className="reviewList">
            {currentReviews.map((review) => (
              <li key={review.ReviewID} className="reviewItem">
                <h4>{review.Title} — Rating: {review.Rating}</h4>
                <p><strong>Data călătoriei:</strong> {review.TravelDate}</p>
                <p><strong>Număr nopți:</strong> {review.NumberOfNights}</p>
                <p><strong>Tip cameră:</strong> {review.RoomType}</p>
                <p><strong>Feedback pozitiv:</strong> {review.PositiveFeedback}</p>
                {review.NegativeFeedback && (
                  <p><strong>Feedback negativ:</strong> {review.NegativeFeedback}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1} className="btnPage">
              ← Anterior
            </button>
            <span>
              Pagina {currentPage} din {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages} className="btnPage">
              Următor →
            </button>
          </div>
        </>
      )}

      <button onClick={() => navigate(-1)} className="btnBack">⬅ Înapoi</button>
    </div>
  );
};

export default HotelDetails;
