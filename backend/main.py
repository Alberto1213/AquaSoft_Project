import pandas as pd
from sqlalchemy import create_engine

df = pd.read_csv('data.csv', delimiter='\t', encoding='utf-16', low_memory=False)
engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')

cities = df[['Property City Name', 'Property Country Code']].copy()
cities = cities.drop_duplicates().dropna()
cities = cities.rename(columns={
    'Property City Name': 'CityName',
    'Property Country Code': 'Country'
})
cities.reset_index(drop=True, inplace=True)
cities['CityID'] = cities.index + 1

regions = df[['Property State/Province']].copy()
regions = regions.drop_duplicates().dropna()
regions = regions.rename(columns={
    'Property State/Province': 'PropertyStateProvinceName'
})
regions.reset_index(drop=True, inplace=True)
regions['PropertyStateProvinceID'] = regions.index + 1


df['Property City Name'] = df['Property City Name'].astype(str).str.strip().str.lower()
df['Property Country Code'] = df['Property Country Code'].astype(str).str.strip().str.upper()

cities['CityName'] = cities['CityName'].astype(str).str.strip().str.lower()
cities['Country'] = cities['Country'].astype(str).str.strip().str.upper()

df = df.merge(
    cities,
    left_on=['Property City Name', 'Property Country Code'],
    right_on=['CityName', 'Country'],
    how='left'
)

df = df.merge(
    regions,
    left_on='Property State/Province',
    right_on='PropertyStateProvinceName',
    how='left'
)

hotels = df[[
    'Global Property ID',
    'Source Property ID',
    'Global Property Name',
    'Global Chain Code',
    'Property Address 1',
    'Property Address 2',
    'Primary Airport Code',
    'CityID',
    'PropertyStateProvinceID',
    'Property Zip/Postal',
    'Property Phone Number',
    'Property Fax Number',
    'Sabre Property Rating',
    'Property Latitude',
    'Property Longitude',
    'Source Group Code'
]].copy()

hotels.columns = [
    'GlobalPropertyID',
    'SourcePropertyID',
    'GlobalPropertyName',
    'GlobalChainCode',
    'PropertyAddress1',
    'PropertyAddress2',
    'PrimaryAirportCode',
    'CityID',
    'PropertyStateProvinceID',
    'PropertyZipPostal',
    'PropertyPhoneNumber',
    'PropertyFaxNumber',
    'SabrePropertyRating',
    'PropertyLatitude',
    'PropertyLongitude',
    'SourceGroupCode'
]

# Remove duplicates inside the DataFrame based on GlobalPropertyID
hotels = hotels.drop_duplicates(subset=['GlobalPropertyID'])

cities.to_sql('Cities', engine, if_exists='append', index=False)
regions.to_sql('Regions', engine, if_exists='append', index=False)
hotels.to_sql('Hotels', engine, if_exists='append', index=False)

print("Hotels imported successfully.")
