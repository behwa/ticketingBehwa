import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent =  ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>

        </div>
    )
};

AppComponent.getInitialProps = async (appContext) => {
    console.log(Object.keys(appContext))
    // console.log(appContext.ctx)
    // return {}
    console.log('Main _App.js')
    
    const client = buildClient(appContext.ctx)
    // console.log('what is my client = ' + client)
    // console.log('client defaults =', client.defaults.baseURL)
    // console.log('Calling /api/users/currentuser...')
    let pageProps = {};
    let currentUser = null;

    console.log('test here 1')
    try {
        const { data } = await client.get('/api/users/currentuser');
        console.log('testing here what is data = ' + data)
        currentUser = data.currentUser;

        // Allow individual page components to also fetch data
        if (appContext.Component.getInitialProps) {
            pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
        }

        console.log('pageProps')
        console.log(pageProps);

        console.log('data =', data);
        // console.log(data);

    } catch (err) {
        console.error('Error fetching current user in _app:', err.message);
    }

    return {
        pageProps,
        currentUser,
    };
}

export default AppComponent;