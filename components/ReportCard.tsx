import React from 'react';
import { FormData } from '../types';

interface ReportCardProps {
  report: FormData;
  onEdit: (report: FormData) => void;
  onDelete: (id: string) => void;
}

const InfoLine: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <p className="text-sm text-slate-600 mt-2 truncate">
    <span className="font-semibold text-slate-700">{label}:</span> {value || 'Não informado'}
  </p>
);

const ReportCard: React.FC<ReportCardProps> = ({ report, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between border border-slate-200 hover:shadow-lg hover:border-yellow-400 transition-all duration-200">
      <div>
        <h3 className="font-bold text-lg text-slate-800 truncate" title={report.cliente}>
          {report.cliente}
        </h3>
        <div className="border-t border-slate-200 my-3"></div>
        <InfoLine label="Equipamento" value={report.tipoEquipamento} />
        {report.tipoEquipamento === 'Elevador' && report.numeroParadas && <InfoLine label="Nº Paradas" value={report.numeroParadas} />}
        <InfoLine label="Responsável" value={report.responsavel} />
        <InfoLine label="Técnico Local" value={report.tecnicoLocal} />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => onDelete(report.id!)}
          className="px-4 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Excluir
        </button>
        <button
          onClick={() => onEdit(report)}
          className="px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ReportCard;