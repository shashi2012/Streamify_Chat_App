import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          { id: authUser._id, name: authUser.fullName, image: authUser.profilePic },
          tokenData.token
        );
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Chat init error:", error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({ text: `Join video call: ${callUrl}` });
      toast.success("Call link sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    /* 100dvh is the magic fix for mobile browser bars. 
      flex-col ensures the header and input stay in place.
    */
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-base-100">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <div className="relative flex h-full min-h-0 w-full flex-col">
            
            {/* Header Section */}
            <div className="relative shrink-0 border-b">
              <CallButton handleVideoCall={handleVideoCall} />
              <ChannelHeader />
            </div>

            {/* Message List - This expands to fill all middle space */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <Window>
                <MessageList />
                {/* Custom Input Wrapper to lift it up and make it wide */}
                <div className="p-2 pb-6 md:pb-4 bg-base-100 border-t">
                  <MessageInput focus grow />
                </div>
              </Window>
            </div>

            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
