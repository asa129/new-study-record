import {
  Box,
  Divider,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
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
        flexDirection="column"
      >
        <Box textAlign="center">
          <Heading as="h1" data-testid="title">
            新・学習記録アプリ
          </Heading>
          <Divider m={4} />
        </Box>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>title</Th>
                <Th>time</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default App;
