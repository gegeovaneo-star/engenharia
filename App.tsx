import React, { useState, ChangeEvent } from 'react';
import { FormData } from './types';
import { BRAZILIAN_STATES, EQUIPMENT_TYPES } from './constants';
import FormSection from './components/FormSection';
import FileUploader from './components/FileUploader';
import Sidebar from './components/Sidebar';
import ReportList from './components/ReportList';

const initialFormData: Omit<FormData, 'id'> = {
  indicador: '',
  responsavel: '',
  tecnicoLocal: '',
  celularTecnico: '',
  cliente: '',
  celularCliente: '',
  endereco: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: 'SP',
  cep: '',
  numeroSerie: '',
  tipoEquipamento: EQUIPMENT_TYPES[0],
  marcaEquipamento: '',
  tipoComando: '',
  numeroParadas: '',
  descricaoProblema: '',
  solucaoSugerida: '',
  resolvido: '',
  atendimentoPresencial: 'nao',
  problemaFotos: [],
  solucaoFotos: [],
};

type View = 'form' | 'emAberto' | 'resolvidas' | 'naoResolvidas';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [problemaFotos, setProblemaFotos] = useState<File[]>([]);
  const [solucaoFotos, setSolucaoFotos] = useState<File[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [reportsEmAberto, setReportsEmAberto] = useState<FormData[]>([]);
  const [reportsResolvidas, setReportsResolvidas] = useState<FormData[]>([]);
  const [reportsNaoResolvidas, setReportsNaoResolvidas] = useState<FormData[]>([]);
  const [activeView, setActiveView] = useState<View>('form');
  const [editingReportId, setEditingReportId] = useState<string | null>(null);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as 'sim' | 'nao' | '' }));
  }

  const handleClear = () => {
    setFormData(initialFormData);
    setEditingReportId(null);
    setProblemaFotos([]);
    setSolucaoFotos([]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let destinationView: View = 'emAberto';
    switch (formData.resolvido) {
        case 'sim': destinationView = 'resolvidas'; break;
        case 'nao': destinationView = 'naoResolvidas'; break;
    }
    
    if (editingReportId) {
        const updatedReport = { ...formData, id: editingReportId, problemaFotos, solucaoFotos };
        
        const allWithoutOld = [
            ...reportsEmAberto,
            ...reportsResolvidas,
            ...reportsNaoResolvidas
        ].filter(r => r.id !== editingReportId);

        const updatedEmAberto = allWithoutOld.filter(r => !r.resolvido || r.resolvido === '');
        const updatedResolvidas = allWithoutOld.filter(r => r.resolvido === 'sim');
        const updatedNaoResolvidas = allWithoutOld.filter(r => r.resolvido === 'nao');

        switch (updatedReport.resolvido) {
            case 'sim': setReportsResolvidas([...updatedResolvidas, updatedReport]); setReportsEmAberto(updatedEmAberto); setReportsNaoResolvidas(updatedNaoResolvidas); break;
            case 'nao': setReportsNaoResolvidas([...updatedNaoResolvidas, updatedReport]); setReportsEmAberto(updatedEmAberto); setReportsResolvidas(updatedResolvidas); break;
            default: setReportsEmAberto([...updatedEmAberto, updatedReport]); setReportsResolvidas(updatedResolvidas); setReportsNaoResolvidas(updatedNaoResolvidas); break;
        }

        alert('Relatório atualizado com sucesso!');
        setEditingReportId(null);

    } else {
        const newReport = { ...formData, id: Date.now().toString(), problemaFotos, solucaoFotos };
        switch (newReport.resolvido) {
            case 'sim': setReportsResolvidas(prev => [...prev, newReport]); break;
            case 'nao': setReportsNaoResolvidas(prev => [...prev, newReport]); break;
            default: setReportsEmAberto(prev => [...prev, newReport]); break;
        }
        alert(`Relatório enviado para a aba '${destinationView === 'emAberto' ? 'Em Aberto' : destinationView === 'resolvidas' ? 'Resolvidas' : 'Não Resolvidas'}' com sucesso!`);
    }

    handleClear();
    setActiveView(destinationView);
  };

  const handleEdit = (reportToEdit: FormData) => {
    setFormData(reportToEdit);
    setEditingReportId(reportToEdit.id!);
    setProblemaFotos(reportToEdit.problemaFotos || []);
    setSolucaoFotos(reportToEdit.solucaoFotos || []);
    setActiveView('form');
  };

  const handleDelete = (reportId: string) => {
      if (window.confirm('Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.')) {
          setReportsEmAberto(prev => prev.filter(r => r.id !== reportId));
          setReportsResolvidas(prev => prev.filter(r => r.id !== reportId));
          setReportsNaoResolvidas(prev => prev.filter(r => r.id !== reportId));
          alert('Relatório excluído com sucesso.');
      }
  };
  
  const renderInputField = (name: keyof Omit<FormData, 'id' | 'resolvido' | 'atendimentoPresencial' | 'problemaFotos' | 'solucaoFotos'>, label: string, required = false, colSpan = "lg:col-span-1", type = "text") => (
    <div className={`col-span-1 md:col-span-1 ${colSpan}`}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name] as string}
        onChange={handleChange}
        required={required}
        className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-900"
      />
    </div>
  );

  const renderForm = () => (
    <>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          SUPORTE TÉCNICO - ENGENHARIA VP
        </h1>
        <p className="text-slate-600 mt-1">
          {editingReportId ? 'Altere os campos necessários e salve as alterações.' : 'Preencha os campos abaixo para registrar o atendimento.'}
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <FormSection title="Informações Gerais">
          {renderInputField('indicador', 'Nome de quem indicou ou solicitou', true, 'lg:col-span-1')}
          {renderInputField('responsavel', 'Responsável pelo atendimento (Verticalparts)', true, 'lg:col-span-1')}
          {renderInputField('tecnicoLocal', 'Nome do técnico no local', true, 'lg:col-span-1')}
          {renderInputField('celularTecnico', 'Nº Celular do técnico', true, 'lg:col-span-1', 'tel')}
        </FormSection>

        <FormSection title="Dados do Cliente">
          {renderInputField('cliente', 'Cliente', true, 'lg:col-span-2')}
          {renderInputField('celularCliente', 'Celular do Cliente', false, 'lg:col-span-2', 'tel')}
          {renderInputField('endereco', 'Endereço', true, 'lg:col-span-2')}
          {renderInputField('complemento', 'Complemento', false, 'lg:col-span-2')}
          {renderInputField('bairro', 'Bairro', true, 'lg:col-span-1')}
          {renderInputField('cidade', 'Cidade', true, 'lg:col-span-1')}
          <div className="col-span-1">
            <label htmlFor="uf" className="block text-sm font-medium text-slate-700">UF <span className="text-red-500">*</span></label>
            <select id="uf" name="uf" value={formData.uf} onChange={handleChange} required className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-900">
              {BRAZILIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>
          {renderInputField('cep', 'CEP', true, 'lg:col-span-1')}
        </FormSection>

        <FormSection title="Dados do Equipamento">
          {renderInputField('numeroSerie', 'Nº de Série', true, 'lg:col-span-1')}
          <div className="col-span-1 lg:col-span-1">
            <label htmlFor="tipoEquipamento" className="block text-sm font-medium text-slate-700">Tipo de equipamento <span className="text-red-500">*</span></label>
            <select id="tipoEquipamento" name="tipoEquipamento" value={formData.tipoEquipamento} onChange={handleChange} required className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-900">
              {EQUIPMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          {formData.tipoEquipamento === 'Elevador' &&
            renderInputField('numeroParadas', 'N. de Paradas', false, 'lg:col-span-1', 'number')
          }
          {renderInputField('marcaEquipamento', 'Marca do equipamento', true, 'lg:col-span-1')}
          {renderInputField('tipoComando', 'Tipo de comando', true, 'lg:col-span-1')}
        </FormSection>

        <FormSection title="Descrição do Problema">
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label htmlFor="descricaoProblema" className="block text-sm font-medium text-slate-700">Descrição do problema informado pelo cliente <span className="text-red-500">*</span></label>
            <textarea id="descricaoProblema" name="descricaoProblema" value={formData.descricaoProblema} onChange={handleChange} required rows={4} className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-900" />
          </div>
          <FileUploader id="problema-fotos" label="Fotos do problema (até 4 arquivos)" onFilesChange={setProblemaFotos} initialFiles={problemaFotos} />
        </FormSection>

        <FormSection title="Solução / Sugestão">
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label htmlFor="solucaoSugerida" className="block text-sm font-medium text-slate-700">Solução / Sugestão VerticalParts</label>
            <textarea id="solucaoSugerida" name="solucaoSugerida" value={formData.solucaoSugerida} onChange={handleChange} rows={6} className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-900" />
          </div>
          <FileUploader id="solucao-fotos" label="Fotos da solução (até 4 arquivos)" onFilesChange={setSolucaoFotos} initialFiles={solucaoFotos} />
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row sm:space-x-8">
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">Resolvido?</legend>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center"><input id="resolvido-sim" name="resolvido" type="radio" value="sim" checked={formData.resolvido === 'sim'} onChange={handleRadioChange} className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" /><label htmlFor="resolvido-sim" className="ml-2 block text-sm text-slate-700">Sim</label></div>
                <div className="flex items-center"><input id="resolvido-nao" name="resolvido" type="radio" value="nao" checked={formData.resolvido === 'nao'} onChange={handleRadioChange} className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" /><label htmlFor="resolvido-nao" className="ml-2 block text-sm text-slate-700">Não</label></div>
              </div>
            </fieldset>
            <fieldset className="mt-4 sm:mt-0">
              <legend className="text-sm font-medium text-slate-700">Necessário atendimento presencial?</legend>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center"><input id="presencial-sim" name="atendimentoPresencial" type="radio" value="sim" checked={formData.atendimentoPresencial === 'sim'} onChange={handleRadioChange} className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" /><label htmlFor="presencial-sim" className="ml-2 block text-sm text-slate-700">Sim</label></div>
                <div className="flex items-center"><input id="presencial-nao" name="atendimentoPresencial" type="radio" value="nao" checked={formData.atendimentoPresencial === 'nao'} onChange={handleRadioChange} className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" /><label htmlFor="presencial-nao" className="ml-2 block text-sm text-slate-700">Não</label></div>
              </div>
            </fieldset>
          </div>
        </FormSection>

        <div className="flex justify-end space-x-4 mt-8 pb-8">
          <button type="button" onClick={handleClear} className="px-6 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 focus:ring-offset-slate-100">
            {editingReportId ? 'Cancelar Edição' : 'Limpar'}
          </button>
          <button type="submit" className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-slate-100">
            {editingReportId ? 'Atualizar Relatório' : 'Enviar Relatório'}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeView === 'form' && renderForm()}
            {activeView === 'emAberto' && <ReportList title="Relatórios em Aberto" reports={reportsEmAberto} onEdit={handleEdit} onDelete={handleDelete} />}
            {activeView === 'resolvidas' && <ReportList title="Relatórios Resolvidos" reports={reportsResolvidas} onEdit={handleEdit} onDelete={handleDelete} />}
            {activeView === 'naoResolvidas' && <ReportList title="Relatórios Não Resolvidos" reports={reportsNaoResolvidas} onEdit={handleEdit} onDelete={handleDelete} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;