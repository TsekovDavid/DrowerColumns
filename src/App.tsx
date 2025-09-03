import { useState } from "react";
import { Button, Box, Table } from "@chakra-ui/react";
import ColumnsDrawer from "./ColumnsDrawer";

// type Column = {
//   data_type: string;
//   field_caption: string;
//   field_description: string;
//   is_custom: boolean;
//   section: string;
//   _id: string;
//   _visible?: boolean;
// };


const initialColumns: Column[] = [
  { data_type: "dd.mm.yyyy",_id: "1", section:"",is_custom: false, field_description:"description 1", field_caption: "Value 1", _visible: true },
  { data_type: "dd.mm.yyyy",_id: "2", section:"",is_custom: false, field_description:"description 2", field_caption: "Value 2", _visible: true },
  { data_type: "dd.mm.yyyy",_id: "3", section:"",is_custom: false, field_description:"description 3", field_caption: "Value 3", _visible: true },
  { data_type: "dd.mm.yyyy",_id: "4", section:"",is_custom: false, field_description:"description 4", field_caption: "Value 4", _visible: false },
  { data_type: "dd.mm.yyyy",_id: "5", section:"",is_custom: false, field_description:"description 5", field_caption: "Value 5", _visible: false },
  { data_type: "dd.mm.yyyy",_id: "6", section:"",is_custom: false, field_description:"description 6", field_caption: "Value 6", _visible: false },
  { data_type: "dd.mm.yyyy",_id: "7", section:"",is_custom: false, field_description:"description 7", field_caption: "Value 7", _visible: true }

];

export default function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [isOpen, setIsOpen] = useState(false);

  const visibleCols = columns.filter((c) => c._visible);

  return (
    <Box p={4}>
      <Button onClick={() => setIsOpen(true)} mb={4}>
        Настроить колонки
      </Button>

      <Table.Root variant="line">
        <Table.Header>
          <Table.Row>
            {visibleCols.map((c) => (
              <Table.ColumnHeader key={c._id}>{c.field_caption}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {visibleCols.map((c) => (
              <Table.Cell key={c._id}>data {c.field_description}</Table.Cell>
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

export type Column = {
  data_type: string;
  field_caption: string;
  field_description: string;
  is_custom: boolean;
  section: string;
  _id: string;
  _visible?: boolean;
};
