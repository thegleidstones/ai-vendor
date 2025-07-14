import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ProdutoScraping } from './types/produto-scraping.type';

@Injectable()
export class ScrapingService {
  async scrapeProdutos(): Promise<ProdutoScraping[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(60000); // 60 segundos

    const url = 'https://trielasmodas.com.br/categoria/105532/62993838328';
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.row.produtos_pagina_0');
    await this.autoScroll(page);

    const produtos = await page.evaluate(() => {
      function extrairCor(descricao: string, categoria: string): string {
        const categoriasCorInicio = ['básicas', 'listradas'];

        const corInicio = categoriasCorInicio.some((c) =>
          categoria.toLowerCase().includes(c),
        );
        const partes = descricao.split('-').map((p) => p.trim());

        return corInicio ? partes[0] : partes[partes.length - 1];
      }

      const baseUrl = 'https://trielasmodas.com.br';
      const lista: ProdutoScraping[] = [];
      const container = document.querySelectorAll('.produtos_div');

      // Extrair código da categoria da URL
      const categoriaPath = window.location.pathname;
      const categoriaCodigo = categoriaPath.split('/')[2] || '';

      // Extrair descrição da categoria
      const categoriaDescricao =
        document.querySelector('.titulo_pagina strong')?.textContent?.trim() ||
        '';

      container.forEach((el) => {
        const idAttr = el.getAttribute('id') || '';
        const codigo = idAttr.replace('produto_div_', '');

        const descricao =
          el.querySelector('.produto_titulo')?.textContent?.trim() || '';
        const preco =
          el.querySelector('.preco_normal')?.textContent?.trim() || '';
        const vendidos =
          el.querySelector('.badge_vendidos')?.textContent?.trim() || '';
        const imagem =
          el
            .querySelector('.square-photo')
            ?.getAttribute('data-background-image') || '';
        const urlProduto = `${baseUrl}${categoriaPath}#produto${codigo}`;
        const urlCategoria = `${baseUrl}${categoriaPath}`;
        const cor = extrairCor(descricao, categoriaDescricao);

        if (codigo && descricao && preco && imagem) {
          lista.push({
            codigo,
            descricao,
            cor,
            preco,
            vendidos,
            imagem,
            urlProduto,
            categoria: {
              codigo: categoriaCodigo,
              descricao: categoriaDescricao,
              urlCategoria,
            },
          });
        }
      });

      return lista;
    });

    await browser.close();
    return produtos;
  }

  private async autoScroll(page: puppeteer.Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 500;

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          const fimBtn = document.querySelector(
            'button.btn-carregar-produtos[disabled]',
          );

          if (fimBtn || totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 500);
      });
    });
  }
}
