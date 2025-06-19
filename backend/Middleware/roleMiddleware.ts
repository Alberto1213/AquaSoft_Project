import jwt, {JwtPayload} from 'jsonwebtoken';

const authorizeRole = (requiredRole: any) => {
  return (req: any, res: any, next: any) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as 
      JwtPayload & {id: number, email: string, role: number};

      if (decoded.role === requiredRole) {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};


export default authorizeRole;