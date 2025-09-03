import { useState } from "react";
import { Button, Box, Table } from "@chakra-ui/react";
import ColumnsDrawer from "./ColumnsDrawer";

type Column = {
  id: string;
  label: string;
  visible: boolean;
};

const initialColumns: Column[] = [
  { id: "1", label: "Value 1", visible: true },
  { id: "2", label: "Value 2", visible: true },
  { id: "3", label: "Value 3", visible: true },
  { id: "4", label: "Value 4", visible: false },
  { id: "5", label: "Value 5", visible: false },
  { id: "6", label: "Value 6", visible: false },
  { id: "7", label: "Value 7", visible: false },
];

export default function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [isOpen, setIsOpen] = useState(false);

  const visibleCols = columns.filter((c) => c.visible);

  return (
    <Box p={4}>
      <Button onClick={() => setIsOpen(true)} mb={4}>
        Настроить колонки
      </Button>

      <Table.Root variant="line">
        <Table.Header>
          <Table.Row>
            {visibleCols.map((c) => (
              <Table.ColumnHeader key={c.id}>{c.label}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {visibleCols.map((c) => (
              <Table.Cell key={c.id}>data {c.label}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <ColumnsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        columns={columns}
        onChange={setColumns}
      />
    </Box>
  );
}