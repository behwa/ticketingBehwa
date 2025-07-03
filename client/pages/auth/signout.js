import { useEffect } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

export default function SignOut() {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="text-center">
        <div className="spinner-border text-warning mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-muted">Signing you out...</h4>
      </div>
    </div>
  );
}
