export interface FormData {
  id?: string;
  indicador: string;
  responsavel: string;
  tecnicoLocal: string;
  celularTecnico: string;
  cliente: string;
  celularCliente: string;
  endereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  numeroSerie: string;
  tipoEquipamento: string;
  marcaEquipamento: string;
  tipoComando: string;
  numeroParadas?: string;
  descricaoProblema: string;
  solucaoSugerida: string;
  resolvido: 'sim' | 'nao' | '';
  atendimentoPresencial: 'sim' | 'nao';
  problemaFotos?: File[];
  solucaoFotos?: File[];
}