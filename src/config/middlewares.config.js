import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'express-compression';
import errorHandler from '../utils/errorHandler/errorHandler.js'
import { requestLogger } from '../utils/logger.js';
import { default as jwt } from 'jsonwebtoken';
import { th } from '@faker-js/faker';

export const configureMiddlewares = (app) => {
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
  app.use(requestLogger);
}

export const configurePostMiddlewares = (app) => {
  app.use(errorHandler);
}

export const validateResetPasswordToken = (redirectOnError = false) => {
  return (req, res, next) => {
      try {
          const token = req.params.token;
          jwt.verify(token, process.env.AUTH_SECRET);
          const data = jwt.decode(token);
          req.email = data.email;
          req.token = token;
          next();
      } catch (error) {
          if (redirectOnError) {
              res.redirect('/resetPasswordRequest');
          } else {
              throw error;
          }
      }
  };
};