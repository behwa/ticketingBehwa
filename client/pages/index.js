import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = (tickets || []).map((ticket, index) => (
    <tr
      key={ticket.id}
      className={index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
    >
      <td>{ticket.title}</td>
      <td>${ticket.price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`}>
          <button className='btn btn-sm btn-primary'>View</button>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-semibold text-center gradient-title">🎟️ Available Tickets!</h2>

      {tickets.length === 0 ? (
        <div className="alert alert-info text-center">No tickets available yet.</div>
      ) : (
        <div className="shadow-lg rounded overflow-hidden">
          <table className="table mb-0">
            <thead className="gradient-header text-white">
              <tr>
                <th className="header-cell">Title</th>
                <th className="header-cell">Price</th>
                <th className="header-cell">Link</th>
              </tr>
            </thead>
            <tbody>{ticketList}</tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .header-cell {
          background: linear-gradient(to right, #f97316, #fb923c, #fdba74);
          color: white;
          font-weight: 600;
          padding: 12px;
          border: none;
        }

        .gradient-title {
          background: linear-gradient(to right, #ff9966, #ff5e62);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gradient-header {
          background: linear-gradient(to right, #f857a6, #ff5858);
        }

        .table-row-light {
          background-color: #fff8f1;
        }

        .table-row-dark {
          background-color: #ffece6;
        }

        .table-row-light:hover,
        .table-row-dark:hover {
          background-color: #ffded1;
        }

        .btn-view {
          background: linear-gradient(to right, #ff9966, #ff5e62);
          color: white;
          padding: 6px 12px;
          font-size: 0.85rem;
          border-radius: 6px;
          display: inline-block;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-view:hover {
          background: linear-gradient(to right, #ff5e62, #ff9966);
          box-shadow: 0 0 8px rgba(255, 94, 98, 0.5);
          transform: translateY(-1px);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
