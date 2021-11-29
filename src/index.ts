import Express, { json } from 'express';
import { Request, Response } from 'express';

const app = Express();
app.use(json());

app.get('*', (request: Request, response: Response) => {
  response.send('hello, world');
});

if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    console.debug(`Listening on port ${process.env.PORT}`);
  });
} else {
  app.listen(3000, () => console.debug(`Listening on port 3000`));
}
