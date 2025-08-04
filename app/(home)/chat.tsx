import ChatScreen from "@/components/chat/screen/ChatScreen";
import { useAuth } from "@/context/AuthContext";


export default function Chat (){
  const { user } = useAuth(); 
    return <ChatScreen currentUserId={user?.id as string}/>
}