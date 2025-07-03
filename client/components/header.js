import Link from 'next/link';

export default function Header({ currentUser }) {
  const commonLinks = [
    { label: 'Sell Tickets', href: '/tickets/new' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Sign Out', href: '/auth/signout' },
  ];

  const guestLinks = [
    { label: 'Sign Up', href: '/auth/signup' },
    { label: 'Sign In', href: '/auth/signin' },
  ];

  const linksToRender = currentUser ? commonLinks : guestLinks;

  return (
    <nav className="navbar navbar-expand px-3" style={{ background: 'linear-gradient(to right, #f97316, #facc15)' }}>
      <Link href="/" className="navbar-brand text-white fw-bold">
        Behwa Ticket System
      </Link>

      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          {linksToRender.map(({ label, href }) => (
            <li key={href} className="nav-item mx-1">
              <Link
                href={href}
                className="nav-link text-white rounded-pill px-3 py-1"
                style={{
                  backgroundColor: '#f97316',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#ea580c')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#f97316')}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
