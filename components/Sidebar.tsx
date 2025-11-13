import React from 'react';
import { PlusCircleIcon, FolderOpenIcon, CheckCircleIcon, XCircleIcon, ChevronLeftIcon } from './icons';

type View = 'form' | 'emAberto' | 'resolvidas' | 'naoResolvidas';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavLink = ({ 
  icon, 
  text, 
  isCollapsed, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode, 
  text: string, 
  isCollapsed: boolean,
  isActive: boolean,
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    title={isCollapsed ? text : ""}
    className={`w-full flex items-center p-2 text-base font-normal rounded-lg group overflow-hidden transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
  >
    {icon}
    <span
      className={`whitespace-nowrap transition-all duration-300 ${
        isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-xs opacity-100 ml-3'
      }`}
    >
      {text}
    </span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeView, setActiveView }) => {
  return (
    <aside
      className={`relative bg-slate-800 shadow-xl h-screen transition-width duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center p-4 h-20 border-b border-slate-700">
          <img
            src={isCollapsed ? "https://verticalparts.volpecom.net/_lib/img/grp__NM__bg__NM__logo_compacto.png" : "https://verticalparts.volpecom.net/_lib/img/grp__NM__bg__NM__logotipo_branco.png"}
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? 'h-8' : 'h-10'}`}
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <ul className="space-y-2">
            <li><NavLink icon={<PlusCircleIcon />} text="Nova Solicitação" isCollapsed={isCollapsed} isActive={activeView === 'form'} onClick={() => setActiveView('form')} /></li>
            <li><NavLink icon={<FolderOpenIcon />} text="Em Aberto" isCollapsed={isCollapsed} isActive={activeView === 'emAberto'} onClick={() => setActiveView('emAberto')} /></li>
            <li><NavLink icon={<CheckCircleIcon />} text="Resolvidas" isCollapsed={isCollapsed} isActive={activeView === 'resolvidas'} onClick={() => setActiveView('resolvidas')} /></li>
            <li><NavLink icon={<XCircleIcon />} text="Não Resolvidas" isCollapsed={isCollapsed} isActive={activeView === 'naoResolvidas'} onClick={() => setActiveView('naoResolvidas')} /></li>
          </ul>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronLeftIcon className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
