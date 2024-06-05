"use client";

import { Box, Button, HStack, Input, StackProps } from "@chakra-ui/react";
import { useTodo } from "../hooks";

function TodoForm() {
  const { initialized, initializeUser, transactionPending, addTodo } = useTodo();
  const stackProps: StackProps = {
    w: "100%",
    maxW: "md",
    alignItems: "stretch",
  };

  return (
    <Box w="md">
      <form onClick={() => addTodo()}>
        <HStack {...stackProps}>
          <Input variant="filled" />
          {initialized ?
            <Button type="submit" colorScheme="green" px="8">Add Todo</Button>
            : <Button colorScheme="green" onClick={() => initializeUser()} disabled={transactionPending}>Initialize</Button>
          }
        </HStack>
      </form>
    </Box>
  );
}

export default TodoForm;
