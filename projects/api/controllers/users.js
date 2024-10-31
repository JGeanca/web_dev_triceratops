import { validateUser, validateLogin } from '../schemas/user.schema.js'
import { validateAddToCart, validateRemoveFromCart, validateUpdateCartItem, validateGetCart, validateCleanCart } from '../schemas/cart.schema.js'
import { signToken } from '../utils.js'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  register = async (req, res) => {
    try {
      const result = await validateUser(req.body)
      if (!result.success) {
        return res.status(422).json({ errors: JSON.parse(result.error.message) })
      }
      if (await this.userModel.usernameExists(result.data)) {
        return res.status(409).json({ message: 'Username already exists' })
      }
      if (await this.userModel.emailExists(result.data)) {
        return res.status(409).json({ message: 'Email already exists' })
      }
      const newUser = await this.userModel.create(result.data)
      const token = signToken(newUser)
      return res.status(201).json({ message: 'User created successfully', token })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  login = async (req, res) => {
    try {
      const result = await validateLogin(req.body)
      if (!result.success) {
        return res.status(422).json({ errors: JSON.parse(result.error.message) })
      }

      const user = await this.userModel.verifyCredentials(result.data)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      const token = signToken(user)
      return res.json({ message: 'Login successful', token })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  getCart = async (req, res) => {
    try {
      const result = await validateGetCart(req.user)
      if (!result.success) {
        return res.status(422).json({ errors: JSON.parse(result.error.message) })
      }
      const cart = await this.userModel.getUserCart(req.user)
      if (!cart) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json({ cart })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  addToCart = async (req, res) => {
    try {

      const userId = req.user.userId
      const result = await validateAddToCart(req.body)

      if (!result.success) {
        return res.status(422).json({ errors: JSON.parse(result.error.message) })
      }

      const cart = await this.userModel.addToCart({ userId, ...req.body })
      if (!cart) {
        return res.status(404).json({ message: 'User or product not found' })
      }
      return res.status(201).json({ message: 'Product added to cart', cart })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  removeFromCart = async (req, res) => {
    try {

      const userId = req.user.userId
      const { key } = req.body

      const result = await validateRemoveFromCart(key)
      if (!result.success) {
        return res.status(422).json({ errors: JSON.parse(result.error.message) })
      }
      const cart = await this.userModel.removeFromCart({ userId, ...key })
      if (!cart) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json({ message: 'Product removed from cart', cart })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  updateCartItem = async (req, res) => {
    try {
      const userId = req.user.userId
      const { key, updates } = req.body

      const result = await validateUpdateCartItem(req.body)
  
      if (!result.success) {
        return res.status(422).json({ errors: result.error.issues })
      }

      const cart = await this.userModel.updateCartItem({ userId, ...key, updates })
  
      if (!cart) {
        return res.status(404).json({ message: 'User or product not found' })
      }
  
      return res.json({ message: 'Cart item updated', cart })
    } catch (error) {
      console.error("Error in updateCartItem controller:", error.message)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  cleanCart = async (req, res) => {
    try {
      const userId = req.user.userId

      const result = await validateCleanCart({ userId })

      if (!result.success) {
        return res.status(422).json({ errors: JSON.parse(result.error.message) })
      }
      const cart = await this.userModel.cleanCart({ userId })
      if (!cart) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json({ message: 'Cart has been cleaned', cart })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}