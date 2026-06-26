import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/cervejas', label: 'Cervejas' },
  { to: '/tanques', label: 'Tanques' },
  { to: '/parametros', label: 'Parâmetros' },
  { to: '/registros', label: 'Registros' },
  { to: '/historico', label: 'Histórico de Lotes' },
];

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 220,
        background: '#1a1a2e',
        color: '#e0e0e0',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <h2 style={{
          textAlign: 'center',
          margin: '0 0 1.5rem',
          fontSize: '1.2rem',
          color: '#f5a623',
          fontWeight: 700,
        }}>
          BrewControl
        </h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.65rem 1.25rem',
                color: isActive ? '#f5a623' : '#c0c0c0',
                background: isActive ? 'rgba(245, 166, 35, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                borderLeft: isActive ? '3px solid #f5a623' : '3px solid transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '1.5rem 2rem', background: '#f5f5f5' }}>
        <Outlet />
      </main>
    </div>
  );
}
