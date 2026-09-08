import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="rgba(15, 23, 42, 0.75)"
        backdropFilter="blur(20px)"
        w="100%"
        px={{ base: 3, md: 6 }}
        py={2.5}
        borderBottom="1px solid rgba(255, 255, 255, 0.08)"
        boxShadow="0 10px 30px rgba(0, 0, 0, 0.4)"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button
            variant="unstyled"
            onClick={onOpen}
            display="flex"
            alignItems="center"
            bg="rgba(10, 15, 26, 0.6)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="full"
            px={4}
            py={1.5}
            h="38px"
            color="#94A3B8"
            _hover={{
              border: "1px solid rgba(99, 102, 241, 0.4)",
              color: "#F8FAFC",
              bg: "rgba(15, 23, 42, 0.8)",
            }}
            transition="all 0.2s ease"
          >
            <i className="fas fa-search" style={{ fontSize: "14px", marginRight: "8px" }}></i>
            <Text display={{ base: "none", md: "flex" }} fontSize="xs" fontWeight="600">
              Search workspace users...
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="800"
          letterSpacing="-0.02em"
          className="gradient-text"
        >
          Talk-A-Tive
        </Text>

        <Box display="flex" alignItems="center" gap={3}>
          <Menu>
            <MenuButton
              p={2}
              position="relative"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.05)"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              transition="all 0.2s ease"
            >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
                style={{
                  backgroundColor: "#6366F1",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              />
              <BellIcon fontSize="xl" color="#CBD5E1" />
            </MenuButton>
            <MenuList p={2} bg="rgba(15, 23, 42, 0.95)" borderColor="rgba(255, 255, 255, 0.1)">
              {!notification.length && (
                <Text p={2} fontSize="xs" color="#94A3B8">
                  No New Messages
                </Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  borderRadius="10px"
                  fontSize="xs"
                  py={2}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<ChevronDownIcon color="#94A3B8" />}
              p={1}
              borderRadius="full"
              _hover={{ bg: "rgba(255, 255, 255, 0.08)" }}
              _active={{ bg: "rgba(255, 255, 255, 0.12)" }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                border="2px solid #6366F1"
              />
            </MenuButton>
            <MenuList bg="rgba(15, 23, 42, 0.95)" borderColor="rgba(255, 255, 255, 0.1)">
              <ProfileModal user={user}>
                <MenuItem fontSize="xs" color="#E2E8F0">
                  <i className="fas fa-user-circle" style={{ marginRight: "8px" }}></i>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider borderColor="rgba(255, 255, 255, 0.08)" />
              <MenuItem fontSize="xs" color="#FCA5A5" onClick={logoutHandler}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: "8px" }}></i>
                Logout Workspace
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(0, 0, 0, 0.6)" />
        <DrawerContent bg="rgba(11, 15, 26, 0.95)" borderRight="1px solid rgba(255, 255, 255, 0.1)">
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.08)" color="#F8FAFC" fontSize="md" fontWeight="700">
            Search Workspace Users
          </DrawerHeader>
          <DrawerBody py={4}>
            <Box display="flex" pb={4} gap={2}>
              <Input
                placeholder="Name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="rgba(15, 23, 42, 0.8)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="12px"
                color="#F8FAFC"
                fontSize="xs"
                _placeholder={{ color: "#64748B" }}
                _focus={{ border: "1px solid #6366F1" }}
              />
              <Button
                onClick={handleSearch}
                bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                color="white"
                borderRadius="12px"
                fontSize="xs"
                px={5}
                _hover={{ opacity: 0.9 }}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" color="#6366F1" mt={4} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
