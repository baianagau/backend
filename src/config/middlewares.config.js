import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'express-compression';
import errorHandler from '../utils/errorHandler/errorHandler.js'

export function configureMiddlewares(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
  app.use(cookieParser());
  app.use(compression({
    brotli: {enabled: true, zlib: {}}
  }));
}

export function configurePostMiddlewares(app) {
  app.use(errorHandler);
}