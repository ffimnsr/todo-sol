"use client";

import { Flex, HStack, Heading, Spacer, StackProps, VStack } from "@chakra-ui/react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useIsMounted, useTodo } from "./hooks";

export default function Home() {
  const mounted = useIsMounted();
  const { notCompletedTodos, markTodo, removeTodo } = useTodo();
  const stackProps: StackProps = {
    p: 4,
  };

  return (
    <main>
      <VStack {...stackProps}>
        <HStack w="md">
          <Heading size="2xl">ToDo</Heading>
          <Spacer />
          {mounted && <WalletMultiButton /> }
        </HStack>
        <TodoForm />
        <TodoList
          todos={notCompletedTodos}
          markTodo={markTodo}
          removeTodo={removeTodo}
        />
      </VStack>
    </main>
  );
}
