import express from "express";
import HotelController from "../controllers/HotelController";
import authorizeRole from "../Middleware/roleMiddleware";

const router = express.Router();

router.get('/', HotelController.getAll);
router.get('/:id', HotelController.getById);
router.get('/name/:name', HotelController.getByName);
router.post('/', authorizeRole(3), HotelController.createHotel);
router.delete('/:id', authorizeRole(3), HotelController.deleteHotel);
router.put('/:id', authorizeRole(3), HotelController.updateHotel);

export default router;