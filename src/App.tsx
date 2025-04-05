import { Box, Divider, Heading } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh"
        w="100vw"
        border="1px solid red"
      >
        <Box textAlign="center">
          <Heading as="h1" data-testid="title">
            新・学習記録アプリ
          </Heading>
          <Divider m={4} />
        </Box>
      </Box>
    </>
  );
}

export default App;
