import { Hotel } from './Hotel';
import { City } from './City';
import { Region } from './Region';
import { Review } from './Review';
import { HotelRatingCategory } from './HotelRatingCategory';
import { RatingCategory } from './RatingCategory';
import { FacilityType } from './Facility';
import { HotelFacility } from './HotelFacility';
import { Rating } from './Rating';
import { CalculatedScore } from './CalculatedScore';
import { User } from './User';

export const setupAssociations = () => {
  Hotel.belongsTo(City, { 
    foreignKey: 'CityID', 
    targetKey: 'CityID',
    as: 'city'
  });

  Hotel.belongsTo(Region, { 
    foreignKey: 'PropertyStateProvinceID', 
    targetKey: 'PropertyStateProvinceID',
    as: 'region'
  });

  City.hasMany(Hotel, { 
    foreignKey: 'CityID', 
    sourceKey: 'CityID',
    as: 'hotels'
  });

  Region.hasMany(Hotel, { 
    foreignKey: 'PropertyStateProvinceID', 
    sourceKey: 'PropertyStateProvinceID',
    as: 'hotels'
  });

  Review.belongsTo(Hotel, {
    foreignKey: 'GlobalPropertyID', 
    targetKey: 'GlobalPropertyID',
    as: 'hotel'
  });

  Hotel.hasMany(Review, {
    foreignKey: 'GlobalPropertyID', 
    sourceKey: 'GlobalPropertyID',
    as: 'reviews'
  });

FacilityType.hasMany(HotelFacility, { foreignKey: 'facilityId' });
HotelFacility.belongsTo(FacilityType, { foreignKey: 'facilityId' });

Hotel.hasMany(HotelFacility, { foreignKey: 'GlobalPropertyID' });
HotelFacility.belongsTo(Hotel, { foreignKey: 'GlobalPropertyID' });

RatingCategory.hasMany(HotelRatingCategory, { foreignKey: 'categoryId' });
HotelRatingCategory.belongsTo(RatingCategory, { foreignKey: 'categoryId' });

Hotel.hasMany(HotelRatingCategory, { foreignKey: 'GlobalPropertyID' });
HotelRatingCategory.belongsTo(Hotel, { foreignKey: 'GlobalPropertyID' });

Hotel.hasOne(Rating, {foreignKey: 'GlobalPropertyID'})
Rating.belongsTo(Hotel, {foreignKey: 'GlobalPropertyID'})

Hotel.hasOne(CalculatedScore, {foreignKey: 'GlobalPropertyID'})
CalculatedScore.belongsTo(Hotel, {foreignKey: 'GlobalPropertyID'})

console.log('Database associations established successfully');
};

export { Hotel, City, Region, FacilityType, HotelFacility, RatingCategory, HotelRatingCategory, Rating, Review, User, CalculatedScore };