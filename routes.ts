import express from 'express';
import userRoutes from './routes/userRoutes';
import hotelRoutes from './routes/hotelRoutes';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow credentials if needed
}));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/hotels', hotelRoutes);


export default app;


/* exemplu pt create
{
  "GlobalPropertyID": 123456789,
  "SourcePropertyID": 12345,
  "GlobalPropertyName": "Hotel Test",
  "GlobalChainCode": "HT",
  "PropertyAddress1": "Strada Exemplu 1",
  "PropertyAddress2": null,
  "PrimaryAirportCode": "OTP",
  "CityID": 1,
  "PropertyStateProvinceID": 2,
  "PropertyZipPostal": "123456",
  "PropertyPhoneNumber": "0123456789",
  "PropertyFaxNumber": "0123456788",
  "SabrePropertyRating": 4.5,
  "PropertyLatitude": 44.4328,
  "PropertyLongitude": 26.1043,
  "SourceGroupCode": "SABRE_GDS"
}
*/