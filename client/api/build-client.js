import axios from 'axios';

export default ({ req }) => {
    console.log('harlo coming build client here?')
    // console.log('req.headers = ' + JSON.stringify(req.headers))
    if(typeof window === 'undefined') { 
        console.log('this is not a window')
        // we are on server 
        return axios.create({
            // baseURL: 'http://www.behwa-ticketing-app-prod.online',
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else {
        console.log('this is window router to /')
        // we are on browser
        return axios.create({
            baseUrl: '/'
        })
    }
}