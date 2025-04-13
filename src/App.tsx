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
import { useEffect, useState } from "react";
import {
  addStudyRecord,
  deleteStudyRecordById,
  GetAllStudyRecords,
} from "./lib/study-record";
import { Record } from "./domain/record";
import { BsPencil } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

function App() {
  const [studyRecords, setStudyRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Partial<Record>>();

  const handleClose = () => {
    reset();
    onClose();
  };

  // データ取得
  const getAllStudyRecords = async () => {
    const records = await GetAllStudyRecords();
    setStudyRecords(records);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllStudyRecords();
  }, []);

  // データ登録
  const onRecordRegist: SubmitHandler<Partial<Record>> = async (data) => {
    const insertData: Partial<Record> = {};
    insertData.title = data.title;
    insertData.time = data.time;
    await addStudyRecord(insertData);
    getAllStudyRecords();
    setIsSubmitSuccessful(true);
    onClose();
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  // データ削除
  const onRecordDelete = async (id: string) => {
    await deleteStudyRecordById(id);
    getAllStudyRecords();
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
          <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={handleSubmit(onRecordRegist)}>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>学習内容</FormLabel>
                    <Input
                      {...register("title", { required: true })}
                      placeholder="学習内容"
                    />
                    {errors.title?.type === "required" && (
                      <p style={{ color: "red" }}>学習内容は必須です</p>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel>学習時間</FormLabel>
                    <Controller
                      name="time"
                      control={control}
                      rules={{ required: true, min: 0 }}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value}
                          onChange={(valueString) => {
                            field.onChange(parseInt(valueString));
                          }}
                        >
                          <NumberInputField />
                          {errors.time?.type === "required" && (
                            <p style={{ color: "red" }}>学習時間は必須です</p>
                          )}
                          {errors.time?.type === "min" && (
                            <p style={{ color: "red" }}>
                              時間は0以上である必要があります
                            </p>
                          )}
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="teal" type="submit">
                    登録
                  </Button>
                </ModalFooter>
              </form>
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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {studyRecords.map((studyRecord) => {
                  return (
                    <Tr key={studyRecord.id}>
                      <Td>{studyRecord.title}</Td>
                      <Td isNumeric>{studyRecord.time}</Td>
                      <Td>編集</Td>
                      <Td>
                        <Button
                          leftIcon={<AiOutlineDelete />}
                          backgroundColor="transparent"
                          _hover={{ backgroundColor: "transparent" }}
                          onClick={() => onRecordDelete(studyRecord.id)}
                        />
                      </Td>
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
