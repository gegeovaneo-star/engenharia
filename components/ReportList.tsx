import React from 'react';
import { FormData } from '../types';
import ReportCard from './ReportCard';

interface ReportListProps {
  title: string;
  reports: FormData[];
  onEdit: (report: FormData) => void;
  onDelete: (id: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ title, reports, onEdit, onDelete }) => {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-600 mt-1">
          {reports.length > 0 ? `Exibindo ${reports.length} relatório(s).` : 'Nenhum relatório para exibir.'}
        </p>
      </header>
      {reports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md border border-slate-200">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">Nenhum relatório</h3>
          <p className="mt-1 text-sm text-slate-500">Comece criando uma nova solicitação.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;
