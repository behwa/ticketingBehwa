// import express from 'express';

// const router = express.Router();

// router.post('/api/users/signout', (req, res) => {
//     res.send('Hi there! Test33 88 signout');
//     req.session = null;
//     res.send({})
// } )

// export { router as signoutRouter };


import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    req.session = null;               // Clear the session cookie
    res.send({});                     // Send a clean response
});

export { router as signoutRouter };