import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col bg-sidebar py-6 text-sidebar-foreground">
        <h2 className="px-4 pb-5 text-center text-xl font-bold text-(--color-yellow)">
          BrewControl
        </h2>
        <Separator className="mb-4 bg-white/10" />

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'border-l-[3px] px-5 py-2.5 text-sm transition-all',
                  isActive
                    ? 'border-(--color-yellow) bg-(--color-yellow)/10 font-semibold text-(--color-yellow)'
                    : 'border-transparent font-normal text-sidebar-foreground/90 hover:bg-white/5',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-background px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
