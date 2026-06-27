import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import iconDashboard from '@/assets/icons/monitor-dashboard.svg';
import iconCervejas from '@/assets/icons/Vector-3.svg';
import iconTanques from '@/assets/icons/Tanque cheio.svg';
import iconParametros from '@/assets/icons/manutencao-1.svg';
import iconRegistros from '@/assets/icons/agenda-pedidos.svg';
import iconHistorico from '@/assets/icons/Frame 126.svg';

const navItems = [
  { to: '/', label: 'Dashboard', icon: iconDashboard },
  { to: '/cervejas', label: 'Cervejas', icon: iconCervejas },
  { to: '/tanques', label: 'Tanques', icon: iconTanques },
  { to: '/parametros', label: 'Parâmetros', icon: iconParametros },
  { to: '/registros', label: 'Registros', icon: iconRegistros },
  { to: '/historico', label: 'Histórico de Lotes', icon: iconHistorico },
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
                  'group flex items-center gap-2.5 border-l-[3px] px-5 py-2.5 text-sm transition-all',
                  isActive
                    ? 'border-(--color-yellow) bg-(--color-yellow)/10 font-semibold text-(--color-yellow)'
                    : 'border-transparent font-normal text-sidebar-foreground/90 hover:bg-white/5',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className={cn(
                      'shrink-0 transition-opacity group-hover:opacity-100',
                      isActive ? 'opacity-100' : 'opacity-85',
                    )}
                  />
                  {item.label}
                </>
              )}
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
