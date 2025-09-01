import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/validation";
import { createProduct, getAllProducts, getProductById } from "./handlers/index";
import { upload } from "./middleware/upload";

const router = Router();

router.get('/products', getAllProducts);

router.get('/products/:id', getProductById);

router.post(
    '/products',
    upload.single('image'), // primero multer
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('price')
        .isNumeric()
        .withMessage('El precio debe ser un número'),
    body('description')
        .notEmpty()
        .withMessage('La descripción no puede estar vacía'),
    body('category')
        .notEmpty()
        .withMessage('La categoría no puede estar vacía'),
    handleInputErrors,
    createProduct
);

export default router;