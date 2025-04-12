import { supabase } from "../utils/supabase";
import { Record } from "../domain/record";

export const GetAllStudyRecords: () => Promise<Record[]> = async () => {
  const { data, error } = await supabase.from("study-record").select();

  if (error) {
    throw new Error(error.message);
  }

  const StudyRecords = data.map(
    (record) =>
      new Record(record.id, record.title, record.time, record.created_at)
  );
  return StudyRecords;
};

export const addStudyRecord = async (data: Partial<Record>) => {
  const { error } = await supabase
    .from("study-record")
    .insert({ title: data.title, time: data.time });

  if (error) {
    throw new Error(error.message);
  }
};
