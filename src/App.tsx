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
  updateStudyRecordById,
} from "./lib/study-record";
import { Record } from "./domain/record";
import { BsPencil } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { TbEditCircle } from "react-icons/tb";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

function App() {
  const [studyRecords, setStudyRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalFlag, setModalFlag] = useState(false); // true: 登録, false: 更新
  const {
    isOpen: isRegistModalOpen,
    onOpen: onRegistModalOpen,
    onClose: onRegistModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<Partial<Record>>();

  const handleClose = () => {
    reset();
    onRegistModalClose();
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

  const handleRegist = () => {
    setModalFlag(true);
    reset();
    onRegistModalOpen();
  };

  // データ登録
  const onRecordRegist: SubmitHandler<Partial<Record>> = async (data) => {
    const insertData: Partial<Record> = {};
    insertData.title = data.title;
    insertData.time = data.time;
    await addStudyRecord(insertData);
    getAllStudyRecords();
    setIsSubmitSuccessful(true);
    onRegistModalClose();
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  // データ削除
  const onRecordDelete = async (id: string) => {
    await deleteStudyRecordById(id);
    getAllStudyRecords();
  };

  const handleEdit = async (data: Partial<Record>) => {
    setModalFlag(false);
    reset();
    // フォームの値をセット
    setValue("id", data.id);
    setValue("title", data.title);
    setValue("time", data.time);
    onEditModalOpen();
  };

  // データ編集
  const onRecordEdit: SubmitHandler<Partial<Record>> = async (data) => {
    // 編集処理
    await updateStudyRecordById(data);
    await getAllStudyRecords();
    setIsSubmitSuccessful(true);
    onEditModalClose();
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
          data-testid="loading"
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
            onClick={handleRegist}
            data-testid="new-record-button"
          >
            登録
          </Button>
          <Modal
            isOpen={modalFlag ? isRegistModalOpen : isEditModalOpen}
            onClose={modalFlag ? handleClose : onEditModalClose}
            data-testid="modal"
          >
            <ModalOverlay />
            <ModalContent>
              <form
                onSubmit={
                  modalFlag
                    ? handleSubmit(onRecordRegist)
                    : handleSubmit(onRecordEdit)
                }
              >
                <ModalHeader data-testid="modal-title">
                  {modalFlag ? "新規登録" : "記録編集"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>学習内容</FormLabel>
                    <Input
                      {...register("title", { required: true })}
                      placeholder="学習内容"
                      data-testid="title-input"
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
                          data-testid="time-input"
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
                  <Button
                    colorScheme="teal"
                    type="submit"
                    data-testid="submit-button"
                  >
                    登録
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Box>
        <Box w="40%">
          <TableContainer>
            <Table variant="striped" colorScheme="teal" data-testid="table">
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
                    <Tr key={studyRecord.id} data-testid="table-row">
                      <Td>{studyRecord.title}</Td>
                      <Td isNumeric>{studyRecord.time}</Td>
                      <Td>
                        <Button
                          rightIcon={<TbEditCircle />}
                          backgroundColor="transparent"
                          _hover={{ backgroundColor: "transparent" }}
                          onClick={() =>
                            handleEdit({
                              id: studyRecord.id,
                              title: studyRecord.title,
                              time: studyRecord.time,
                            })
                          }
                          data-testid="edit-button"
                        />
                      </Td>
                      <Td>
                        <Button
                          rightIcon={<AiOutlineDelete />}
                          backgroundColor="transparent"
                          _hover={{ backgroundColor: "transparent" }}
                          onClick={() => onRecordDelete(studyRecord.id)}
                          data-testid="delete-button"
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
