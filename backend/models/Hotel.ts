import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

export const Hotel = sequelize.define('Hotel', {
  GlobalPropertyID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    allowNull: false 
  },
  SourcePropertyID: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  GlobalPropertyName: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  GlobalChainCode: { 
    type: DataTypes.STRING(10), 
    allowNull: true 
  },
  PropertyAddress1: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  PropertyAddress2: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  PrimaryAirportCode: { 
    type: DataTypes.STRING(10), 
    allowNull: true 
  },
  CityID: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: { 
      model: 'Cities', 
      key: 'CityID' 
    } 
  },
  PropertyStateProvinceID: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: { 
      model: 'Regions', 
      key: 'PropertyStateProvinceID' 
    } 
  },
  PropertyZipPostal: { 
    type: DataTypes.STRING(30), 
    allowNull: true 
  },
  PropertyPhoneNumber: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  PropertyFaxNumber: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  SabrePropertyRating: { 
    type: DataTypes.DECIMAL(3,1), 
    allowNull: true 
  },
  PropertyLatitude: { 
    type: DataTypes.DECIMAL(9, 6), 
    allowNull: true 
  },
  PropertyLongitude: { 
    type: DataTypes.DECIMAL(9,6), 
    allowNull: true 
  },
  SourceGroupCode: { 
    type: DataTypes.STRING(10), 
    allowNull: true 
  }
}, {
  tableName: 'Hotels',
  timestamps: false
});