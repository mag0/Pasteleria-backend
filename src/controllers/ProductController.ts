import { Request, Response } from 'express';
import Product from "../models/Product";
import cloudinary from '../config/cloudinary';
import { v4 as uuid } from 'uuid';

interface MulterRequest extends Request {
    file: Express.Multer.File;
}


export class ProductController {
    static async getAllProducts(req: Request, res: Response) {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id).select('-__v');

            if (!product) {
                return res.status(404).json({ message: 'El producto no existe' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Hubo un error al buscar el producto' });
        }
    }

    static async createProduct(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'La imagen no puede estar vacía' });
            }

            const { name, price, description, category } = req.body;

            const existingName = await Product.findOne({ name });
            if (existingName) {
                return res.status(409).json({ message: 'Ya existe un producto con ese nombre' });
            }

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'productos', public_id: uuid() },
                    (error, result) => {
                        if (error || !result) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            }) as { secure_url: string; public_id: string };

            const newProduct = new Product({
                name,
                price,
                description,
                category,
                imageUrl: uploadResult.secure_url,
                imagePublicId: uploadResult.public_id,
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error al crear el producto' });
        }
    }

    static async updateProduct(req: MulterRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name, price, description, category } = req.body;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            if (req.file) {
                // Eliminar imagen anterior si existe
                if (product.imagePublicId) {
                    await cloudinary.uploader.destroy(product.imagePublicId);
                }

                // Subir nueva imagen desde buffer
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "bakery-products", public_id: uuid() },
                        (error, result) => {
                            if (error || !result) reject(error);
                            else resolve(result);
                        }
                    ).end(req.file.buffer);
                }) as { secure_url: string; public_id: string };

                product.imageUrl = uploadResult.secure_url;
                product.imagePublicId = uploadResult.public_id;
            }

            const existingName = await Product.findOne({ name });
            if (existingName && existingName._id.toString() !== id) {
                return res.status(409).json({ message: "Ya existe un producto con ese nombre" });
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;

            await product.save();
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            // Eliminar imagen de Cloudinary si existe
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }

            await product.deleteOne();
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
