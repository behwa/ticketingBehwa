import express from 'express';
// import jwt from 'jsonwebtoken';

import { currentUser } from '@behwatickets/common';
// import { requireAuth } from '../middlewares/require-auth';

// import { currentUser } from '../middlewares/current-user';
// import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUser/*, requireAuth*/, (req, res) => {
    console.log('current-user.ts here')
        // console.log('current-user.ts here = ' + currentUser)
        // console.log('current-user.ts here = ' + JSON.stringify(req.currentUser))
    res.send( { currentUser: req.currentUser || null } )

    // res.send('Hi there! Test33 88 currentuser');

    // if( !(req.session?.jwt) ) {
    //     return res.send({currentUser: null})
    // }

    // try {
    //     const payload = jwt.verify(
    //         req.session.jwt, process.env.JWT_KEY!
    //     );

    //     res.send({ currentUser: payload });
    // } catch (err) {
    //     res.send({ currentUser: null })
    // }


} )

export { router as currentUserRouter };