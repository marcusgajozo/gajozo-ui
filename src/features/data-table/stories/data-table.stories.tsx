import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, type DataTableProps } from "../ui";
import styles from "../ui/hooks/use-create-action-column.module.css";

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
  {
    id: "acoes",
    size: 48,
    header: "Ações",
    cell: () => (
      <div className={styles.actionCell}>
        <button className={styles.actionButton} aria-label="Ações">
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    columns,
    data,
    totalItems: 100,
    onSelectRow: () => {},
  },
};
