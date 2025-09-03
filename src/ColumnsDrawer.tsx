import { useState, useEffect } from "react";
import {
  Drawer,
  Input,
  Switch,
  Box,
  Flex,
  IconButton,
  Text,
  Separator,
} from "@chakra-ui/react";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Column = {
  id: string;
  label: string;
  visible: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onChange: (cols: Column[]) => void;
};

function SortableItem({ column, toggle }: { column: Column; toggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Flex ref={setNodeRef} style={style} align="center" p={2} bg="gray.50" mb={2} borderRadius="md">
      <IconButton
        aria-label="drag"
        {...attributes}
        {...listeners}
        size="sm"
        mr={2}
      >
        <GripVertical />
      </IconButton>
      <Text flex="1">{column.label}</Text>
      <Switch.Root checked={column.visible} onCheckedChange={() => toggle()}>
        <Switch.HiddenInput style={{ display: "none" }} />
        <Switch.Control />
      </Switch.Root>
    </Flex>
  );
}

function SimpleItem({ column, toggle }: { column: Column; toggle: () => void }) {
  return (
    <Flex align="center" p={2} bg="gray.50" mb={2} borderRadius="md">
      <Box w="24px" mr={2} /> {/* пустое место под иконку */}
      <Text flex="1">{column.label}</Text>
      <Switch.Root checked={column.visible} onCheckedChange={() => toggle()}>
        <Switch.HiddenInput style={{ display: "none" }} />
        <Switch.Control />
      </Switch.Root>
    </Flex>
  );
}

export default function ColumnsDrawer({ isOpen, onClose, columns, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [localCols, setLocalCols] = useState(columns);

  // Синхронизируем локальное состояние при открытии и изменении пропсов
  useEffect(() => {
    setLocalCols(columns);
  }, [columns, isOpen]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setLocalCols((items) => {
        const visible = items.filter((c) => c.visible);
        const hidden = items.filter((c) => !c.visible);
        const oldIndex = visible.findIndex((i) => i.id === active.id);
        const newIndex = visible.findIndex((i) => i.id === over.id);
        const newVisible = arrayMove(visible, oldIndex, newIndex);
        const newItems = [...newVisible, ...hidden];
        onChange(newItems);
        return newItems;
      });
    }
  };

  const toggleVisible = (id: string) => {
    setLocalCols((cols) => {
      const updated = cols.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c));
      onChange(updated);
      return updated;
    });
  };

  const filtered = localCols.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));
  const visible = filtered.filter((c) => c.visible);
  const hidden = filtered.filter((c) => !c.visible);

  return (
    <Drawer.Root open={isOpen} placement="end" size="sm" onOpenChange={(e) => { if (!e.open) onClose(); }}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>Настройка колонок</Drawer.Header>
          <Drawer.Body>
            <Input
              placeholder="Поиск..."
              mb={4}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Text mb={2} fontWeight="bold">
              Отображаемые поля
            </Text>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={visible.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {visible.map((c) => (
                  <SortableItem key={c.id} column={c} toggle={() => toggleVisible(c.id)} />
                ))}
              </SortableContext>
            </DndContext>

            <Separator my={4} />

            <Text mb={2} fontWeight="bold">
              Скрытые поля
            </Text>
            {hidden.map((c) => (
              <SimpleItem key={c.id} column={c} toggle={() => toggleVisible(c.id)} />
            ))}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}