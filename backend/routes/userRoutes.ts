import express from "express";
import userController from "../controllers/UserController";
import authorizeRole from "../Middleware/roleMiddleware";

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authorizeRole(3), userController.getAllUsers);
router.delete('/:id', authorizeRole(3), userController.deleteUser);
router.put('/:id', authorizeRole(3), userController.updateUser);

export default router;