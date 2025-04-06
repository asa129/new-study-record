import { supabase } from "../utils/supabase";
import { StudyRecord } from "../domain/StudyRecord";

export const GetAllStudyRecords: () => Promise<StudyRecord[]> = async () => {
  const { data, error } = await supabase.from("study-record").select();

  if (error) {
    throw new Error(error.message);
  }

  const StudyRecords = data.map(
    (record) =>
      new StudyRecord(record.id, record.title, record.time, record.created_at)
  );
  return StudyRecords;
};
