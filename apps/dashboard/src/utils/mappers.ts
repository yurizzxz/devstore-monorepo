const getCategoryName = (categoryId?: number) => {
  const categories: { [key: number]: string } = {
    1: "Processador",
    2: "Placa de Vídeo",
    3: "Memória RAM",
    4: "Notebook",
    5: "Smartphones",
    6: "Mais Vendidos",
    7: "Promoções do Dia",
    8: "Promoção",
  };
  return categories[categoryId || 0] || "";
};

const getStatsName = (statsId?: number) => {
  const stats: { [key: number]: string } = {
    0: "Pendente",
    1: "Ativo",
    2: "Cancelado",
    3: "Finalizado",
  };
  return stats[statsId || 0] || "";
};

export { getCategoryName, getStatsName };
