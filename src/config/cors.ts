import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL];

        // Permitir peticiones sin origin (ej. Postman, SSR, etc.)
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true,
};