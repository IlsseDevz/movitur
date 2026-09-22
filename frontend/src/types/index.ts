export type TipoExperiencia = 'AVENTURA' | 'PRAIA' | 'CULTURA' | 'LUXO' | 'FAMILIA';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  tipoExperiencia: TipoExperiencia;
  ativo: boolean;
}

export interface CategoriaRequest {
  nome: string;
  descricao?: string;
  tipoExperiencia: TipoExperiencia;
  ativo?: boolean;
}

export interface Destino {
  id: number;
  nome: string;
  descricao?: string;
  provincia: string;
  cidade: string;
  imagemUrl?: string;
  precoMedioEstimado?: number;
  latitude?: number;
  longitude?: number;
  ativo: boolean;
  categoriaId: number;
  categoriaNome?: string;
  avaliacaoMedia?: number;
  totalFeedbacks?: number;
}

export interface DestinoRequest {
  nome: string;
  descricao?: string;
  provincia: string;
  cidade: string;
  imagemUrl?: string;
  precoMedioEstimado?: number;
  latitude?: number;
  longitude?: number;
  categoriaId: number;
  ativo?: boolean;
}

export type DestinoOrdenacao = 'NOME_ASC' | 'NOME_DESC' | 'PRECO_ASC' | 'PRECO_DESC';

export interface GuiaTuristico {
  id: number;
  nome: string;
  biografia?: string;
  anosExperiencia: number;
  fotoUrl?: string;
  avaliacaoMedia: number;
  ativo: boolean;
  destinoIds: number[];
}

export interface GuiaTuristicoRequest {
  nome: string;
  biografia?: string;
  anosExperiencia: number;
  fotoUrl?: string;
  ativo?: boolean;
  destinoIds?: number[];
}

export interface DestinoSugerido {
  id: number;
  nome: string;
  cidade: string;
  provincia: string;
  precoMedioEstimado: number;
  custoTotalEstimado: number;
  viavel: boolean;
}

export interface SimuladorRequest {
  orcamento: number;
  numeroDias: number;
  tipoExperiencia?: TipoExperiencia;
  destinoId?: number;
  titulo?: string;
  guardar?: boolean;
}

export type TipoEstabelecimento = 'HOTEL' | 'RESTAURANTE';
export type PlanoAnuncio = 'GRATUITO' | 'BRONZE' | 'PRATA' | 'OURO';
export type StatusPagamentoEstabelecimento = 'ATIVO' | 'INATIVO' | 'PENDENTE';

export interface Estabelecimento {
  id: number;
  nome: string;
  descricao?: string;
  tipo: TipoEstabelecimento;
  imagemUrl?: string;
  endereco?: string;
  avaliacaoMedia: number;
  precoMedio?: number;
  ativo: boolean;
  destinoId: number;
  destinoNome?: string;
  destinoCidade?: string;
  destinoProvincia?: string;
  planoAnuncio: PlanoAnuncio;
  statusPagamento: StatusPagamentoEstabelecimento;
  dataExpiracao?: string;
  prioridadeExibicao?: number;
  prioridadeEfectiva?: number;
  patrocinado: boolean;
}

export interface EstabelecimentoRequest {
  nome: string;
  descricao?: string;
  tipo: TipoEstabelecimento;
  imagemUrl?: string;
  endereco?: string;
  avaliacaoMedia?: number;
  precoMedio?: number;
  destinoId: number;
  planoAnuncio: PlanoAnuncio;
  statusPagamento: StatusPagamentoEstabelecimento;
  dataExpiracao?: string;
  ativo?: boolean;
}

export interface SimuladorResponse {
  simulacaoId?: number;
  titulo?: string;
  destinoId?: number;
  destinoNome?: string;
  destinoCidade?: string;
  destinoProvincia?: string;
  orcamento: number;
  numeroDias: number;
  tipoExperiencia?: TipoExperiencia;
  custoHospedagem?: number;
  custoAlimentacao?: number;
  custoTransporte?: number;
  custoAtividades?: number;
  custoTotal?: number;
  viagemViavel: boolean;
  saldoRestante?: number;
  mensagem?: string;
  criadoEm?: string;
  destinosSugeridos?: DestinoSugerido[];
  hoteisSugeridos?: Estabelecimento[];
  restaurantesSugeridos?: Estabelecimento[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export type Role = 'CLIENTE' | 'ADMIN';
export type StatusConta = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  role: Role;
  status: StatusConta;
  criadoEm?: string;
}

export interface RegistoRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  id: number;
  nomeCompleto: string;
  email: string;
  role: Role;
}

export interface RegistoResponse {
  mensagem: string;
  usuario: Usuario;
}

export type StatusReserva = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REJEITADA';
export type StatusPagamento = 'NAO_PAGO' | 'PARCIAL' | 'PAGO';
export type MetodoPagamento = 'MPESA' | 'TRANSFERENCIA' | 'POUPANCA';
export type StatusVerificacaoPagamento = 'PENDENTE' | 'CONFIRMADO' | 'REJEITADO';

export interface Reserva {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
  destinoId: number;
  destinoNome: string;
  destinoCidade: string;
  destinoProvincia: string;
  guiaId?: number;
  guiaNome?: string;
  dataInicio: string;
  numeroDias: number;
  numeroPessoas: number;
  observacoes?: string;
  status: StatusReserva;
  precoEstimado?: number;
  valorPago?: number;
  valorRestante?: number;
  statusPagamento?: StatusPagamento;
  avaliada?: boolean;
  podeAvaliar?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ReservaRequest {
  destinoId: number;
  guiaId?: number;
  dataInicio: string;
  numeroDias: number;
  numeroPessoas: number;
  observacoes?: string;
}

export interface Avaliacao {
  id: number;
  guiaId: number;
  guiaNome: string;
  reservaId: number;
  usuarioNome: string;
  nota: number;
  comentario?: string;
  criadoEm?: string;
}

export interface AvaliacaoRequest {
  reservaId: number;
  nota: number;
  comentario?: string;
}

export interface RecuperarSenhaRequest {
  email: string;
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
}

export interface AtualizarPerfilRequest {
  telefone?: string;
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface MetaPoupanca {
  id: number;
  titulo: string;
  valorMeta: number;
  valorAcumulado: number;
  percentual: number;
  destinoId?: number;
  destinoNome?: string;
  dataLimite?: string;
  ativa: boolean;
  criadoEm?: string;
}

export interface MetaPoupancaRequest {
  titulo: string;
  valorMeta: number;
  destinoId?: number;
  dataLimite?: string;
}

export interface DepositoPoupanca {
  id: number;
  metaId: number;
  valor: number;
  descricao?: string;
  criadoEm?: string;
}

export interface DepositoPoupancaRequest {
  valor: number;
  descricao?: string;
}

export interface Pagamento {
  id: number;
  reservaId: number;
  destinoNome: string;
  valor: number;
  metodo: MetodoPagamento;
  referencia?: string;
  metaPoupancaId?: number;
  metaPoupancaTitulo?: string;
  usuarioNome?: string;
  usuarioEmail?: string;
  statusVerificacao?: StatusVerificacaoPagamento;
  motivoRejeicao?: string;
  criadoEm?: string;
}

export interface PagamentoRequest {
  reservaId: number;
  valor: number;
  metodo: MetodoPagamento;
  referencia?: string;
  metaPoupancaId?: number;
}

export type TipoFavorito = 'DESTINO' | 'GUIA';

export interface Favorito {
  id: number;
  tipo: TipoFavorito;
  itemId: number;
  nome: string;
  subtitulo?: string;
  imagemUrl?: string;
  criadoEm?: string;
}

export interface FavoritoIds {
  destinoIds: number[];
  guiaIds: number[];
}

export interface FavoritoRequest {
  tipo: TipoFavorito;
  itemId: number;
}

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  link?: string;
  lida: boolean;
  criadoEm?: string;
}

export interface DestinoReservaResumo {
  destinoId: number;
  destinoNome: string;
  totalReservas: number;
}

export interface RelatorioResumo {
  totalClientes: number;
  reservasPendentes: number;
  reservasConfirmadas: number;
  reservasCanceladas: number;
  reservasRejeitadas: number;
  receitaConfirmada: number;
  pagamentosPendentes: number;
  valorReservasConfirmadas: number;
  topDestinos: DestinoReservaResumo[];
}

export type TipoFeedbackAlvo = 'DESTINO' | 'GUIA' | 'HOTEL' | 'RESTAURANTE';

export interface Feedback {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  tipoAlvo: TipoFeedbackAlvo;
  entidadeId: number;
  entidadeNome: string;
  estrelas: number;
  comentario: string;
  criadoEm?: string;
}

export interface FeedbackRequest {
  tipoAlvo: TipoFeedbackAlvo;
  entidadeId: number;
  estrelas: number;
  comentario: string;
}

export interface FeedbackResumo {
  total: number;
  mediaEstrelas: number;
}
