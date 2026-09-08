import {
  Box,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="lg" centerContent py={12} position="relative" zIndex={1}>
      {/* Brand Header */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={6}
        bg="rgba(255, 255, 255, 0.85)"
        backdropFilter="blur(20px)"
        w="100%"
        m="0 0 20px 0"
        borderRadius="24px"
        border="1px solid rgba(226, 232, 240, 0.8)"
        boxShadow="0 20px 40px rgba(148, 163, 184, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
      >
        <Flex alignItems="center" gap={3} mb={1}>
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg="#10B981"
            className="online-pulse"
          />
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.1em"
            color="#64748B"
            textTransform="uppercase"
          >
            Real-Time Messaging
          </Text>
        </Flex>
        <Text
          fontSize="4xl"
          fontWeight="800"
          letterSpacing="-0.02em"
          className="gradient-text"
          textAlign="center"
        >
          Talk-A-Tive
        </Text>
      </Box>

      {/* Auth Card Panel */}
      <Box
        bg="rgba(255, 255, 255, 0.85)"
        backdropFilter="blur(20px)"
        w="100%"
        p={6}
        borderRadius="24px"
        border="1px solid rgba(226, 232, 240, 0.8)"
        boxShadow="0 25px 50px rgba(148, 163, 184, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
      >
        <Tabs variant="unstyled" isFitted>
          <TabList
            mb={6}
            bg="rgba(241, 245, 249, 0.8)"
            p={1.5}
            borderRadius="full"
            border="1px solid rgba(226, 232, 240, 0.8)"
          >
            <Tab
              borderRadius="full"
              py={2.5}
              fontWeight="700"
              fontSize="sm"
              color="#64748B"
              _selected={{
                bg: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.35)",
              }}
              transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
            >
              Sign In
            </Tab>
            <Tab
              borderRadius="full"
              py={2.5}
              fontWeight="700"
              fontSize="sm"
              color="#64748B"
              _selected={{
                bg: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.35)",
              }}
              transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
            >
              Create Account
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Login />
            </TabPanel>
            <TabPanel p={0}>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;

