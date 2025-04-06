import { Box, Divider, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { GetAllStudyRecords } from "./lib/study-record";

function App() {
  useEffect(() => {
    const getAllStudyRecords = async () => {
      const records = await GetAllStudyRecords();
      console.log(records);
    };
    getAllStudyRecords();
  }, []);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh"
        w="100vw"
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
