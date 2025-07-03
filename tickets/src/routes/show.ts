import express, { Request, Response } from 'express';
import { NotFoundError } from '@behwatickets/common';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new NotFoundError(); // Treat invalid ID format as "not found"
//   }

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };


// import express, {Request, Response} from 'express';
// import { NotFoundError } from '@behwatickets/common';
// import { Ticket } from '../models/ticket';

// const router = express.Router();

// router.get('/api/tickets/:id', async(req: Request, res: Response) => {
//     const ticket = await Ticket.findById(req.params.id);

//     if(!ticket) {
//         throw new NotFoundError();
//     }

//     res.send(ticket);
// })

// export { router as showTicketRouter };