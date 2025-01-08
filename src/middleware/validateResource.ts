import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (ex: any) {
    console.log(ex.errors);
    return res.status(400).send(ex.errors);
  }
};

export default validate;
