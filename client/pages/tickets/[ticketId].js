import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">{ticket.title}</h2>
        <h4 className="text-center text-muted mb-4">Price: ${ticket.price}</h4>

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

        <button
          onClick={() => doRequest()}
          className="btn btn-warning w-100 fw-bold text-white"
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
