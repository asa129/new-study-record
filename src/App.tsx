import {
  Box,
  Divider,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GetAllStudyRecords } from "./lib/study-record";
import { Record } from "./domain/record";

function App() {
  const [studyRecords, setStudyRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getAllStudyRecords = async () => {
      const records = await GetAllStudyRecords();
      setStudyRecords(records);
      setIsLoading(false);
    };
    getAllStudyRecords();
  }, []);
  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh"
        w="100vw"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }
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
                <Th>title</Th>
                <Th>time</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {studyRecords.map((studyRecord) => {
                return (
                  <Tr key={studyRecord.id}>
                    <Td>{studyRecord.title}</Td>
                    <Td isNumeric>{studyRecord.time}</Td>
                    <Td></Td>
                    <Td></Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default App;
