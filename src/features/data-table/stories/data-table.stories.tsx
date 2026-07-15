import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";

import { DataTable } from "../ui/data-table";
import styles from "../ui/data-table.module.css";

const meta = {
  title: "Features/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DataTable>;

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
    id: "select",
    header: () => (
      <input type="checkbox" className={styles.checkbox} aria-label="Selecionar todos" />
    ),
    cell: ({ row }) => (
      <div className={styles.checkboxCell}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Selecionar linha"
        />
      </div>
    ),
  },
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
    header: "Ações",
    cell: () => (
      <div className={styles.actionCell}>
        <button className={styles.actionButton} aria-label="Ações">
          <FontAwesomeIcon icon={faEllipsisVertical} />
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
  },
};
