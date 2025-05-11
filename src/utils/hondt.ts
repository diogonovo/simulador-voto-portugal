export function calcularHondt(
    votos: Record<string, number>,
    lugares: number
  ): Record<string, number> {
    const quocientes: { partido: string; valor: number }[] = [];
  
    for (const partido in votos) {
      for (let i = 1; i <= lugares; i++) {
        quocientes.push({
          partido,
          valor: votos[partido] / i,
        });
      }
    }
  
    // Ordenar os maiores quocientes
    quocientes.sort((a, b) => b.valor - a.valor);
  
    // Selecionar os lugares
    const atribuicoes: Record<string, number> = {};
    for (let i = 0; i < lugares; i++) {
      const partido = quocientes[i].partido;
      atribuicoes[partido] = (atribuicoes[partido] || 0) + 1;
    }
  
    return atribuicoes;
  }
  