import { Hotel } from '../models/Hotel';
import { City } from '../models/City';
import { Region } from '../models/Region';
import { Request, Response } from 'express';
import { CalculatedScore } from '../models/CalculatedScore';
import { Model } from 'sequelize/types/model';

interface IHotel {
  GlobalPropertyID: number;
  SourcePropertyID?: string | null;
  GlobalPropertyName?: string | null;
  GlobalChainCode?: string | null;
  PropertyAddress1?: string | null;
  PropertyAddress2?: string | null;
  PrimaryAirportCode?: string | null;
  CityID?: number | null;
  PropertyStateProvinceID?: number | null;
  PropertyZipPostal?: string | null;
  PropertyPhoneNumber?: string | null;
  PropertyFaxNumber?: string | null;
  SabrePropertyRating?: number | null;
  PropertyLatitude?: number | null;
  PropertyLongitude?: number | null;
  SourceGroupCode?: string | null;
}
const getAll = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.findAll({
          include: [
            { model: City, as: 'city' },
            { model: Region, as: 'region' },
            {model: CalculatedScore, as: 'CalculatedScore'}
          ],
          limit: 100
        });
        
        res.json(hotels);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}

const getByName = async(req: Request, res: Response) =>{
    try {
    const hotelName = req.params.name;

    const hotel = await Hotel.findOne({
      where: { GlobalPropertyName: hotelName },
      include: [
        { model: City, as: 'city' },
        { model: Region, as: 'region' }
      ]
    }) as (Model & IHotel) | null;

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const id = hotel?.GlobalPropertyID;
    const calculatedScore = await CalculatedScore.findOne({
      where: {GlobalPropertyID: id!}
    })

    res.status(200).json({hotel, "Calculated Score": calculatedScore});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

const getById = async(req: Request, res: Response) =>{
    try{
    const id = req.params.id;
    const hotel = await Hotel.findByPk(id);

    const calculatedScore = await CalculatedScore.findOne({
      where: {GlobalPropertyID: id}
    })
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }else{
      res.status(200).json({ message: 'Hotel found', hotel, calculatedScore: calculatedScore});
    }
  }catch(error: any){
    res.status(500).json({ error: error.message });
  }
}

const updateHotel = async(req: Request , res: Response) => {
    try{
    const id = req.params.id;
    const data = req.body;
    const hotel = await Hotel.findByPk(id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }else{
      await hotel.update(data);
      res.status(200).json({ message: 'Hotel updated', hotel });
    }
  }catch(error: any){
    res.status(500).json({ error: error.message });
  }
}

const deleteHotel = async(req: Request, res: Response)=>{
    try{
    const id = req.params.id;
    const hotel = await Hotel.findByPk(id);

    if(!hotel){
      return res.status(404).json({ message: 'Hotel not found' });
    }else{
      await Hotel.destroy({ where: { GlobalPropertyID: id } });
      res.status(200).json({message: 'Hotel deleted'});
    }
  }catch(error: any){
    res.status(500).json({error: error.message});
  }
}

const createHotel = async(req: Request, res: Response) => {
    
      try {
        const {
          GlobalPropertyID,
          SourcePropertyID,
          GlobalPropertyName,
          GlobalChainCode,
          PropertyAddress1,
          PropertyAddress2,
          PrimaryAirportCode,
          CityID,
          PropertyStateProvinceID,
          PropertyZipPostal,
          PropertyPhoneNumber,
          PropertyFaxNumber,
          SabrePropertyRating,
          PropertyLatitude,
          PropertyLongitude,
          SourceGroupCode
        } = req.body;
    
        // Creează hotelul
        const newHotel = await Hotel.create({
          GlobalPropertyID,
          SourcePropertyID,
          GlobalPropertyName,
          GlobalChainCode,
          PropertyAddress1,
          PropertyAddress2,
          PrimaryAirportCode,
          CityID,
          PropertyStateProvinceID,
          PropertyZipPostal,
          PropertyPhoneNumber,
          PropertyFaxNumber,
          SabrePropertyRating,
          PropertyLatitude,
          PropertyLongitude,
          SourceGroupCode
        });
    
        res.status(201).json(newHotel);
      } catch (error: any) {
        res.status(500).json({error: error.message });
      }
}
export default {getAll, getById, getByName, updateHotel, deleteHotel, createHotel};