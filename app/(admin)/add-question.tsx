import AddQuestionScreen from "@/components/admin/screen/AddQuestionScreen";
import { useLocalSearchParams } from "expo-router";



export default function AddQuestion(){
    const { id } = useLocalSearchParams();
    return <AddQuestionScreen testId={id as string} />
}