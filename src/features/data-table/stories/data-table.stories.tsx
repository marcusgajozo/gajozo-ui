import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, type DataTableProps } from "../ui";

const meta: Meta<DataTableProps<Viagem>> = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Viagem = {
  id: string;
  sentido: string;
  partida: string;
  chegada: string;
  placa: string;
  prefixo: string;
  assentos: number;
};

const data: Viagem[] = [
  {
    id: "1",
    sentido: "Ida",
    partida: "06h00",
    chegada: "15h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "2",
    sentido: "Volta",
    partida: "06h00",
    chegada: "15h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "3",
    sentido: "Ida",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "4",
    sentido: "Volta",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "5",
    sentido: "Ida",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "6",
    sentido: "Volta",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "7",
    sentido: "Ida",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "8",
    sentido: "Volta",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "9",
    sentido: "Ida",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
  {
    id: "10",
    sentido: "Volta",
    partida: "21h00",
    chegada: "06h41",
    placa: "-",
    prefixo: "-",
    assentos: 48,
  },
];

const columns: ColumnDef<Viagem>[] = [
  {
    accessorKey: "sentido",
    header: "Sentido",
  },
  {
    accessorKey: "partida",
    header: "Partida",
  },
  {
    accessorKey: "chegada",
    header: "Chegada",
  },
  {
    accessorKey: "placa",
    header: "Placa do Veículo",
  },
  {
    accessorKey: "prefixo",
    header: "Prefixo do Veículo",
  },
  {
    accessorKey: "assentos",
    header: "Assentos",
  },
];

export const Default: Story = {
  args: {
    columns,
    data,
    totalItems: 100,
    onSelectRow: () => {},
    actionColumn: [
      {
        title: "Editar",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
        onAction: (row) => window.alert(`Editar item: ${row.id}`),
      },
      {
        title: "Excluir",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        ),
        onAction: (row) => window.alert(`Excluir item: ${row.id}`),
      },
    ],
  },
};
