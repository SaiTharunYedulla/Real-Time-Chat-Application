import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon color="#94A3B8" />}
        onClick={onOpen}
        variant="ghost"
        borderRadius="full"
        _hover={{ bg: "rgba(255, 255, 255, 0.1)", color: "#F8FAFC" }}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered size="md">
        <ModalOverlay backdropFilter="blur(12px)" bg="rgba(0, 0, 0, 0.7)" />
        <ModalContent
          bg="rgba(15, 23, 42, 0.95)"
          border="1px solid rgba(255, 255, 255, 0.12)"
          borderRadius="24px"
          color="#F8FAFC"
          boxShadow="0 30px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.2)"
        >
          <ModalHeader
            fontSize="xl"
            fontWeight="800"
            display="flex"
            justifyContent="center"
            className="gradient-text"
            pt={5}
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton color="#94A3B8" borderRadius="full" />
          <ModalBody display="flex" flexDir="column" alignItems="center" gap={3}>
            <Box w="100%" display="flex" flexWrap="wrap" gap={1} pb={2}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex" gap={2}>
              <Input
                placeholder="Rename Group..."
                value={groupChatName || ""}
                onChange={(e) => setGroupChatName(e.target.value)}
                bg="rgba(10, 15, 26, 0.6)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="14px"
                color="#F8FAFC"
                fontSize="sm"
                py={5}
                _placeholder={{ color: "#64748B" }}
                _focus={{ border: "1px solid #6366F1" }}
              />
              <Button
                borderRadius="14px"
                bg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                color="white"
                fontWeight="700"
                fontSize="xs"
                px={6}
                isLoading={renameloading}
                onClick={handleRename}
                _hover={{ opacity: 0.9 }}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add member to group..."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                bg="rgba(10, 15, 26, 0.6)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="14px"
                color="#F8FAFC"
                fontSize="sm"
                py={5}
                _placeholder={{ color: "#64748B" }}
                _focus={{ border: "1px solid #6366F1" }}
              />
            </FormControl>

            {loading ? (
              <Spinner size="md" color="#6366F1" my={2} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter pb={5}>
            <Button
              onClick={() => handleRemove(user)}
              w="100%"
              borderRadius="14px"
              bg="rgba(239, 68, 68, 0.15)"
              border="1px solid rgba(239, 68, 68, 0.3)"
              color="#FCA5A5"
              fontWeight="700"
              fontSize="xs"
              py={5}
              _hover={{
                bg: "rgba(239, 68, 68, 0.25)",
                color: "#FFFFFF",
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
