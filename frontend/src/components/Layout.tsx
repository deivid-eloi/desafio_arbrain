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
        background: 'var(--color-primary)',
        color: 'var(--color-gray-light)',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <h2 style={{
          textAlign: 'center',
          margin: '0 0 1.5rem',
          padding: '0 0 1.25rem',
          fontSize: '1.2rem',
          color: 'var(--color-yellow)',
          fontWeight: 700,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
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
                color: isActive ? 'var(--color-yellow)' : 'var(--color-gray-light)',
                background: isActive ? 'rgba(255, 197, 36, 0.12)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                borderLeft: isActive ? '3px solid var(--color-yellow)' : '3px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={{
        flex: 1,
        padding: '1.5rem 2rem',
        background: 'var(--color-bg)',
        animation: 'fadeIn 0.3s ease',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
