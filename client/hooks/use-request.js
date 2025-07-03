import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
    // method ==== 'post', 'get'
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            console.log('hihi')
            // console.log('url =' + url)
            // console.log('method =' + method)
            // console.log('data =' + JSON.stringify(body))
            const response = await axios.request({
                url,
                method,
                data: { ...body, ...props }, // Merge original body with runtime props
            });

            if(onSuccess) {
                onSuccess(response.data)
            }
            
            setErrors(null); // Clear errors on success
            return response.data;
        } catch (err) {
            // console.log('err here = ' + err)
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops....</h4>
                    <ul className="my-0">
                        {err.response?.data?.errors?.map((err, i) =>
                            <li key={i}>{err.message}</li>
                        )}
                    </ul>
                </div>
            )

            // throw err; // rethrowing the error
        }
    }

    return { doRequest, errors }
}

export default useRequest;