import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request"; // fixed typo: useReqeust -> useRequest

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Create a Ticket</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              type="text"
              placeholder="e.g. Concert"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={onBlur}
              className="form-control"
              type="number"
              placeholder="e.g. 49.99"
              min="0"
              step="0.01"
              required
            />
          </div>

          {errors && (
            <div className="alert alert-danger">
              <h6 className="mb-1">Oops...</h6>
              <ul className="mb-0">
                {Array.isArray(errors)
                  ? errors.map((err) => <li key={err.message}>{err.message}</li>)
                  : errors}
              </ul>
            </div>
          )}

          <button type="submit" className="btn btn-warning w-100 fw-bold text-white">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
