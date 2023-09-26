import swaggerUIExpress from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import {bronxLogger } from '../utils/logger.js';

export default function configureSwagger(app) {

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'BRONX API',
                version: '1.0.0',
                description: 'Authorization through JWT cookie is not supported in Swagger due to browser security restrictions.',
            },
            servers: [
                {
                    description: `${process.env.NODE_ENV} server`,
                    url: `http://localhost:${process.env.PORT}`,
                },
            ],
        },
        apis: ['./src/**/*.yaml'],
        // apis: ['./src/docs/**/*.yaml'],
    };

    const specs = swaggerJsDoc(swaggerOptions);
    app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs) );

}