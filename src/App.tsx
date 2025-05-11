import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { calcularHondt } from "./utils/hondt";


const partidos = ["PS", "PSD", "BE", "CDU", "CH", "IL", "PAN", "LIVRE"];

// Tipos e dados iniciais por distrito
type Distrito = {
  nome: string;
  deputados: number;
  votos: Record<string, number>;
};

const distritosIniciais: Distrito[] = [
  {
    nome: "Lisboa",
    deputados: 48,
    votos: {
      PS: 300000,
      PSD: 280000,
      BE: 80000,
      CDU: 60000,
      CH: 100000,
      IL: 90000,
      PAN: 20000,
      LIVRE: 15000,
    },
  },
  {
    nome: "Porto",
    deputados: 40,
    votos: {
      PS: 250000,
      PSD: 240000,
      BE: 60000,
      CDU: 40000,
      CH: 80000,
      IL: 70000,
      PAN: 15000,
      LIVRE: 10000,
    },
  },
  {
    nome: "Braga",
    deputados: 19,
    votos: {
      PS: 100000,
      PSD: 95000,
      BE: 20000,
      CDU: 15000,
      CH: 30000,
      IL: 25000,
      PAN: 7000,
      LIVRE: 5000,
    },
  },
];

export default function App() {
  const [percentagemNacional, setPercentagemNacional] = useState(50);
  const [distritos, setDistritos] = useState<Distrito[]>(distritosIniciais);

  const resultados = useMemo(() => {
    const totalDeputados = distritos.reduce((acc, d) => acc + d.deputados, 0);
    const nacionalPercent = percentagemNacional / 100;
    const distritalPercent = 1 - nacionalPercent;

    const deputadosDistritais: Record<string, number> = {};
    const totalVotosNacionais: Record<string, number> = {};

    for (const partido of partidos) totalVotosNacionais[partido] = 0;

    // Cálculo distrital
    for (const distrito of distritos) {
      const distritalLugares = Math.round(distrito.deputados * distritalPercent);
      const atribuicoes = calcularHondt(distrito.votos, distritalLugares);

      for (const partido of partidos) {
        deputadosDistritais[partido] = (deputadosDistritais[partido] || 0) + (atribuicoes[partido] || 0);
        totalVotosNacionais[partido] += distrito.votos[partido];
      }
    }

    // Cálculo nacional
    const deputadosNacionais = calcularHondt(
      totalVotosNacionais,
      Math.round(totalDeputados * nacionalPercent)
    );

    const atribuicoes: Record<string, number> = {};
    for (const partido of partidos) {
      atribuicoes[partido] =
        (deputadosDistritais[partido] || 0) + (deputadosNacionais[partido] || 0);
    }

    return Object.entries(atribuicoes).map(([nome, deputados]) => ({
      nome,
      deputados,
      percentagem: ((deputados / totalDeputados) * 100).toFixed(1) + "%",
    }));
  }, [percentagemNacional, distritos]);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-12 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-10">
        Simulador de Voto em Portugal por Distrito
      </h1>
  
      <div className="grid gap-6">
        {distritos.map((distrito, idx) => (
          <div
            key={distrito.nome}
            className="bg-white border rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              {distrito.nome} — {distrito.deputados} deputados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {partidos.map((partido) => (
                <div key={partido} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{partido}</label>
                  <input
                    type="number"
                    min={0}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={distrito.votos[partido]}
                    onChange={(e) => {
                      const novosDistritos = [...distritos];
                      novosDistritos[idx].votos[partido] =
                        parseInt(e.target.value) || 0;
                      setDistritos(novosDistritos);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  
      {/* Slider */}
      <div className="bg-white mt-10 p-6 rounded-lg shadow-sm border max-w-2xl mx-auto">
        <label className="block font-medium mb-3">
          Percentagem de deputados eleitos pelo círculo nacional:
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={percentagemNacional}
          onChange={(e) => setPercentagemNacional(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="mt-2 text-sm">
          Nacional: <strong>{percentagemNacional}%</strong> | Distrital:{" "}
          <strong>{100 - percentagemNacional}%</strong>
        </p>
      </div>
  
      {/* Gráfico */}
      <div className="mt-10">
        <h2 className="font-semibold text-lg mb-3 text-center">
          Distribuição Total de Deputados
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={resultados} margin={{ top: 30 }}>
            <XAxis dataKey="nome" />
            <YAxis allowDecimals={false} domain={[0, "dataMax + 2"]} />
            <Tooltip />
            <Bar dataKey="deputados">
              <LabelList dataKey="deputados" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
  
      {/* Tabela */}
      <div className="mt-10 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="font-semibold text-lg mb-4">Resumo Nacional</h2>
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Partido</th>
              <th className="p-2 text-left">Deputados</th>
              <th className="p-2 text-left">Percentagem</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r) => (
              <tr key={r.nome} className="border-t border-gray-200">
                <td className="p-2">{r.nome}</td>
                <td className="p-2">{r.deputados}</td>
                <td className="p-2">{r.percentagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
}