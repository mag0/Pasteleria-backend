import { Router } from "express";
import { handleInputErrors } from "../middleware/validation";
import { upload } from "../middleware/upload";
import { validateProductInput } from "../middleware/Product";
import { ProductController } from "../controllers/ProductController";

const router = Router();

router.get('/products', ProductController.getAllProducts);

router.get('/products/:id', ProductController.getProductById);

router.post(
    '/products',
    upload.single('image'),
    validateProductInput,
    handleInputErrors,
    ProductController.createProduct
);

router.put('/products/:id',
    upload.single('image'),
    validateProductInput,
    handleInputErrors,
    ProductController.updateProduct
);

router.delete('/products/:id',
    handleInputErrors,
    ProductController.deleteProduct);

export default router;