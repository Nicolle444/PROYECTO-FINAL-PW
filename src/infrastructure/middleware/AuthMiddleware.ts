import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '../../domain/entities/User.js'

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'inventario-pyme-secret-2024'

export interface JwtPayload {
  userId: string
  email: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' })
    return
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: 'Invalid token format' })
    return
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const requireRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' })
      return
    }
    next()
  }
}
