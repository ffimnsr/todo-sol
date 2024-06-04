"use client"

import { HStack, IconButton, Spacer, VStack, Text, StackDivider, border, StackProps, IconButtonProps } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

type Todo = {
  id: string;
  text: string;
};

type Props = {
  todos: Todo[];
  removeTodo: (id: string) => void;
};

function TodoList({ removeTodo }: Props) {
  const itemListStackProps: StackProps = {
    p: "4",
    w: "100%",
    borderRadius: "lg",
    borderWidth: "1px",
    borderColor: "gray.200",
    alignItems: "stretch",
    divider: <StackDivider />,
  };

  const itemButtonProps: IconButtonProps = {
    icon: <FaTrash />,
    isRound: true,
    "aria-label": "Delete Todo",
  };

  const todos: Todo[] = [
    {
      id: "1",
      text: "Buy groceries",
    },
    {
      id: "2",
      text: "Walk the dog",
    }
  ];
  return (
    <VStack {...itemListStackProps}>
      {todos.map(todo => (
        <HStack key={todo.id} p="8">
          <Text>{todo.text}</Text>
          <Spacer />
          <IconButton onClick={() => removeTodo(todo.id)} {...itemButtonProps} />
        </HStack>
      ))}
    </VStack>
  );
}

export default TodoList;
