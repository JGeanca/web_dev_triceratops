import express, { json } from 'express'
import { createProductsRouter } from './routes/products.js'
import { createUsersRouter } from './routes/users.js'
import { createCartsRouter } from './routes/carts.js'
import { createOrdersRouter } from './routes/orders.js'
import { mainRouter } from './routes/main.js'
import { errorHandler } from './middlewares/errorHandler.js'
import logger from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

export const createApp = ({ productModel, userModel, cartModel, orderModel }) => {
  dotenv.config()
  const app = express()
  app.use(logger('dev'))
  app.use(cors())
  app.use(json())
  app.use(errorHandler)
  app.disable('x-powered-by')

  app.use('/', mainRouter)
  app.use('/products', createProductsRouter({ productModel }))
  app.use('/users', createUsersRouter({ userModel }))
  app.use('/carts', createCartsRouter({ cartModel }))
  app.use('/orders', createOrdersRouter({ orderModel }))

  return app
}

export const startApp = async (app, port = process.env.PORT ?? 3000) => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`)
      resolve(server);
    })
  })
}