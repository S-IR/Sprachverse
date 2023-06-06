import { NextApiRequest, NextApiResponse } from "next";
import util from 'util'
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/blogger',
  'https://www.googleapis.com/auth/calendar'
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const {access_token, firebaseUID} = req.query
        if(access_token ===undefined || firebaseUID ===undefined )
            res.status(401).send('Unauthorized')
        const 
        console.log(util.inspect(myObject, false, null, true /* enable colors */))

      // Process a POST request
    } else {
      // Handle any other HTTP method
    }
  }