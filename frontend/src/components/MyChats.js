import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import { makeAuthRequest } from "../config/api";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    if (!user || !user.token) {
      return;
    }

    try {
      setLoading(true);
      const data = await makeAuthRequest('get', '/api/chat', null, user.token);
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  // Set logged user from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
  }, []);

  // Only fetch chats when user is available and when fetchAgain changes
  useEffect(() => {
    if (user && user.token) {
      fetchChats();
    }
  }, [user, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="rgba(15, 23, 42, 0.75)"
      backdropFilter="blur(20px)"
      w={{ base: "100%", md: "32%" }}
      borderRadius="24px"
      border="1px solid rgba(255, 255, 255, 0.08)"
      boxShadow="0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
    >
      <Box
        pb={4}
        px={1}
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="800"
        letterSpacing="-0.02em"
        color="#F8FAFC"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text className="gradient-text">Messages</Text>
        <GroupChatModal>
          <Button
            display="flex"
            size="sm"
            fontSize="xs"
            fontWeight="700"
            borderRadius="full"
            bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
            color="white"
            rightIcon={<AddIcon fontSize="10px" />}
            _hover={{
              bg: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s ease"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={2}
        bg="rgba(10, 15, 26, 0.5)"
        w="100%"
        h="100%"
        borderRadius="16px"
        border="1px solid rgba(255, 255, 255, 0.04)"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" spacing={2} pr={1}>
            {chats.map((chat) => {
              const isSelected = selectedChat === chat;
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={
                    isSelected
                      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)"
                      : "rgba(255, 255, 255, 0.03)"
                  }
                  border={
                    isSelected
                      ? "1px solid rgba(99, 102, 241, 0.6)"
                      : "1px solid rgba(255, 255, 255, 0.05)"
                  }
                  color="#F8FAFC"
                  px={4}
                  py={3}
                  borderRadius="14px"
                  key={chat._id}
                  _hover={{
                    bg: isSelected
                      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.45) 100%)"
                      : "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    transform: "translateX(2px)",
                  }}
                  transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                >
                  <Text fontWeight="700" fontSize="sm" color={isSelected ? "#FFFFFF" : "#E2E8F0"}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs" color={isSelected ? "#CBD5E1" : "#94A3B8"} mt={0.5} noOfLines={1}>
                      <span style={{ fontWeight: 600, color: isSelected ? "#A5B4FC" : "#64748B" }}>
                        {chat.latestMessage.sender.name}:{" "}
                      </span>
                      {chat.latestMessage.content.length > 45
                        ? chat.latestMessage.content.substring(0, 46) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
