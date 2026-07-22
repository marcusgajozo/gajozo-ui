import type { ColumnDef } from "@tanstack/react-table";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { DataTable } from "../ui";

afterEach(() => {
  cleanup();
});

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

  const data: Viagem[] = Array.from({ length: 50 }).map((_, i) => ({
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

  beforeEach(() => {
    window.history.replaceState(null, "", window.location.pathname);
  });

  test("should render the table looking like the reference image (structural verification)", async () => {
    render(<DataTable columns={columns} data={data} totalItems={100} />);

    expect(screen.getByText("Sentido")).toBeTruthy();
    expect(screen.getByText("Partida")).toBeTruthy();
    expect(screen.getByText("Chegada")).toBeTruthy();
    expect(screen.getByText("Placa do Veículo")).toBeTruthy();
    expect(screen.getByText("Prefixo do Veículo")).toBeTruthy();
    expect(screen.getByText("Assentos")).toBeTruthy();
    expect(screen.getByText("Ações")).toBeTruthy();

    const idas = screen.getAllByText("Ida");
    expect(idas.length).toBeGreaterThan(0);
    const voltas = screen.getAllByText("Volta");
    expect(voltas.length).toBeGreaterThan(0);

    expect(screen.getByText("Exibir")).toBeTruthy();
    expect(screen.getByText("1-10 de 100 itens")).toBeTruthy();
    expect(screen.getByText("Página")).toBeTruthy();

    expect(screen.getByTestId("page-size-select")).toBeTruthy();
    expect(screen.getByTestId("page-index-select")).toBeTruthy();
    expect(screen.getByTestId("prev-page-button")).toBeTruthy();
    expect(screen.getByTestId("next-page-button")).toBeTruthy();
  });

  test("should sync initial page and pageSize from URL parameters", async () => {
    window.history.replaceState(null, "", `${window.location.pathname}?currentPage=2&perPage=10`);

    render(<DataTable columns={columns} data={data} totalItems={100} />);

    expect(screen.getByText("11-20 de 100 itens")).toBeTruthy();
  });

  test("should update URL search parameters when navigating pages", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} totalItems={100} />);

    const nextBtn = screen.getByTestId("next-page-button");
    await user.click(nextBtn);

    expect(window.location.search).toContain("currentPage=2");
    expect(window.location.search).toContain("perPage=10");
    expect(screen.getByText("11-20 de 100 itens")).toBeTruthy();
  });
});
