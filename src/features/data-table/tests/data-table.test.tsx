import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import { DataTable } from "../ui/data-table";

describe("DataTable E2E Look-alike tests", () => {
  type Viagem = {
    id: string;
    sentido: string;
    partida: string;
    chegada: string;
    placa: string;
    prefixo: string;
    assentos: number;
  };

  const data: Viagem[] = Array.from({ length: 10 }).map((_, i) => ({
    id: String(i),
    sentido: i % 2 === 0 ? "Ida" : "Volta",
    partida: "06h00",
    chegada: "15h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  }));

  const columns: ColumnDef<Viagem>[] = [
    {
      id: "select",
      header: () => <input type="checkbox" aria-label="Selecionar todos" />,
      cell: () => <input type="checkbox" aria-label="Selecionar linha" />,
    },
    { accessorKey: "sentido", header: "Sentido" },
    { accessorKey: "partida", header: "Partida" },
    { accessorKey: "chegada", header: "Chegada" },
    { accessorKey: "placa", header: "Placa do Veículo" },
    { accessorKey: "prefixo", header: "Prefixo do Veículo" },
    { accessorKey: "assentos", header: "Assentos" },
    {
      id: "acoes",
      header: "Ações",
      cell: () => <button aria-label="Ações">⋮</button>,
    },
  ];

  test("should render the table looking like the reference image (structural verification)", async () => {
    render(<DataTable columns={columns} data={data} totalItems={100} />);

    expect(screen.getByText("Sentido")).toBeInTheDocument();
    expect(screen.getByText("Partida")).toBeInTheDocument();
    expect(screen.getByText("Chegada")).toBeInTheDocument();
    expect(screen.getByText("Placa do Veículo")).toBeInTheDocument();
    expect(screen.getByText("Prefixo do Veículo")).toBeInTheDocument();
    expect(screen.getByText("Assentos")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();

    const idas = screen.getAllByText("Ida");
    expect(idas.length).toBeGreaterThan(0);
    const voltas = screen.getAllByText("Volta");
    expect(voltas.length).toBeGreaterThan(0);

    expect(screen.getByText("Exibir")).toBeInTheDocument();
    expect(screen.getByText("1-10 de 100 itens")).toBeInTheDocument();
    expect(screen.getByText("Página")).toBeInTheDocument();

    expect(screen.getByTestId("page-size-select")).toBeInTheDocument();
    expect(screen.getByTestId("page-index-select")).toBeInTheDocument();
    expect(screen.getByTestId("prev-page-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-page-button")).toBeInTheDocument();
  });
});
