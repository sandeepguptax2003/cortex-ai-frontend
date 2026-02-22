declare module 'compression';
declare module 'cors';
declare module 'helmet';
declare module 'morgan';
declare module 'express-rate-limit';
declare module 'express-validator';
declare module 'bcryptjs';
declare module 'jsonwebtoken';
declare module 'dotenv';
declare module 'pg';
declare module 'redis';
declare module 'ws';
declare module 'uuid';

declare module '*' {
  const content: any;
  export default content;
}