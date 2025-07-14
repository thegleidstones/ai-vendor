export type ProdutoScraping = {
  codigo: string;
  descricao: string;
  cor: string;
  preco: string;
  vendidos: string;
  imagem: string;
  urlProduto: string;
  categoria: {
    codigo: string;
    descricao: string;
    urlCategoria: string;
  };
};
