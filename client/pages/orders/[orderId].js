import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      const secondsLeft = Math.round(msLeft / 1000);

      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) {
        setExpired(true);
      }
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (expired) {
    return (
      <div className="alert alert-danger text-center mt-4">
        ⏰ Order Expired
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Complete Payment</h3>

      <div className={`alert ${timeLeft < 10 ? 'alert-warning' : 'alert-info'}`}>
        ⏳ Time left to pay: <strong>{timeLeft}</strong> seconds
      </div>

      <div className="mb-3">
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51JU9uOIEhLEzWRmVu65cUmIflNnhnOXSxRblbUHPPq7ow0G8se51zbxS6GkzNYfNmQLIZWymPQRgWxT39fGYae9U00T7SfV5wP"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        >
          <button className="btn btn-success btn-lg">
            💳 Pay ${order.ticket.price}
          </button>
        </StripeCheckout>
      </div>

      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
