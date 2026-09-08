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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

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
            Create New Group
          </ModalHeader>
          <ModalCloseButton color="#94A3B8" borderRadius="full" />
          <ModalBody display="flex" flexDir="column" alignItems="center" gap={3}>
            <FormControl>
              <Input
                placeholder="Group Chat Title"
                mb={2}
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
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search users to add..."
                mb={2}
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
            <Box w="100%" display="flex" flexWrap="wrap" gap={1}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Box color="#94A3B8" fontSize="xs" py={2}>Searching users...</Box>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter pb={5}>
            <Button
              onClick={handleSubmit}
              w="100%"
              borderRadius="14px"
              bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
              color="white"
              fontWeight="700"
              fontSize="sm"
              py={5}
              _hover={{
                bg: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
              }}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
