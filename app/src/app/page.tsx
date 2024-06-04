import { Heading, VStack } from "@chakra-ui/react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main>
      <VStack p={4}>
        <Heading size="2xl">ToDo</Heading>
        <TodoForm />
        <TodoList />
      </VStack>
    </main>
  );
}
