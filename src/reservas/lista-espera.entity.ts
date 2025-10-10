export class ReservaEntity {
  idReserva: number;
  idUsuario: number;
  dataSolicitacao: Date;
  statusReserva: 'ATIVA' | 'CANCELADA' | 'EXPIRADA';
  dataNotificacao?: Date;
  prazoEmprestimo?: Date;
  dataRetirada?: Date;
  dataDevolucao?: Date;
}
