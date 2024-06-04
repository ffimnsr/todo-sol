import { HStack, IconButton, Spacer, VStack, Text, StackDivider } from "@chakra-ui/react";

type Todo = {
  id: string;
  text: string;
};

function TodoList() {
  const vStackProps = {
    p: "4",
    w: "100%",
    alignItems: "stretch",
    divider: <StackDivider />,
  };
  const todos = [1,1,1,1];
  return (
    <VStack {...vStackProps}>
      {todos.map(_ => (
        <HStack p="8">
          <Text>1</Text>
          <Spacer />
          <IconButton aria-label="Delete Todo" />
        </HStack>
      ))}
    </VStack>
  );
}

export default TodoList;
