import { Button, HStack, Input } from "@chakra-ui/react";

function TodoForm() {
  return (
    <form>
      <HStack>
        <Input variant="filled" />
        <Button type="submit" colorScheme="green" px="8">Add Todo</Button>
      </HStack>
    </form>
  );
}

export default TodoForm;
