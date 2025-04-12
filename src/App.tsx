import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { addStudyRecord, GetAllStudyRecords } from "./lib/study-record";
import { Record } from "./domain/record";
import { BsPencil } from "react-icons/bs";
import React from "react";

function App() {
  const [studyRecords, setStudyRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(0);
  useEffect(() => {
    const getAllStudyRecords = async () => {
      const records = await GetAllStudyRecords();
      setStudyRecords(records);
      setIsLoading(false);
    };
    getAllStudyRecords();
  }, []);
  const onRecordRegist = async () => {
    const insertData: Partial<Record> = {};
    insertData.title = title;
    insertData.time = time;
    await addStudyRecord(insertData);
    onClose();
  };

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
          <Divider m={4} w="20vw" />
        </Box>
        <Box display="flex" justifyContent="flex-end" w="40%" mb={4}>
          <Button
            leftIcon={<BsPencil />}
            colorScheme="teal"
            variant="solid"
            onClick={onOpen}
          >
            登録
          </Button>
          <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel>学習内容</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="学習内容"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setTitle(e.target.value)
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>学習時間</FormLabel>
                  <NumberInput
                    defaultValue={0}
                    max={50}
                    min={0}
                    onChange={(_, valueAsNumber: number) =>
                      setTime(valueAsNumber)
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" onClick={onRecordRegist}>
                  登録
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
        <Box w="40%">
          <TableContainer>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>title</Th>
                  <Th>time</Th>
                  <Th>編集</Th>
                  <Th>削除</Th>
                </Tr>
              </Thead>
              <Tbody>
                {studyRecords.map((studyRecord) => {
                  return (
                    <Tr key={studyRecord.id}>
                      <Td>{studyRecord.title}</Td>
                      <Td isNumeric>{studyRecord.time}</Td>
                      <Td>編集</Td>
                      <Td>削除</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}

export default App;
