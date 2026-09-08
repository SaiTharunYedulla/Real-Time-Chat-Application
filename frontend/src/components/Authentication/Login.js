import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      const data = response.data;

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to login";
      toast({
        title: "Error Occurred!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl id="email" isRequired>
        <FormLabel color="#334155" fontSize="sm" fontWeight="600" mb={1.5}>
          Email Address
        </FormLabel>
        <Input
          value={email || ""}
          type="email"
          placeholder="name@company.com"
          onChange={(e) => setEmail(e.target.value)}
          bg="rgba(255, 255, 255, 0.9)"
          border="1px solid #E2E8F0"
          borderRadius="14px"
          color="#0F172A"
          fontSize="sm"
          py={5}
          _placeholder={{ color: "#94A3B8" }}
          _hover={{ border: "1px solid rgba(99, 102, 241, 0.4)" }}
          _focus={{
            border: "1px solid #4F46E5",
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
            bg: "#FFFFFF",
          }}
          transition="all 0.2s ease"
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel color="#334155" fontSize="sm" fontWeight="600" mb={1.5}>
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="••••••••••••"
            bg="rgba(255, 255, 255, 0.9)"
            border="1px solid #E2E8F0"
            borderRadius="14px"
            color="#0F172A"
            fontSize="sm"
            py={5}
            _placeholder={{ color: "#94A3B8" }}
            _hover={{ border: "1px solid rgba(99, 102, 241, 0.4)" }}
            _focus={{
              border: "1px solid #4F46E5",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
              bg: "#FFFFFF",
            }}
            transition="all 0.2s ease"
          />
          <InputRightElement width="4.5rem" h="100%" display="flex" alignItems="center">
            <Button
              h="1.8rem"
              size="xs"
              onClick={handleClick}
              bg="rgba(241, 245, 249, 0.9)"
              color="#64748B"
              borderRadius="8px"
              _hover={{ bg: "#E2E8F0", color: "#0F172A" }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        width="100%"
        mt={2}
        py={6}
        borderRadius="14px"
        bg="linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
        color="#FFFFFF"
        fontWeight="700"
        fontSize="sm"
        boxShadow="0 4px 20px rgba(99, 102, 241, 0.3)"
        _hover={{
          bg: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
          boxShadow: "0 6px 25px rgba(99, 102, 241, 0.45)",
          transform: "translateY(-1px)",
        }}
        _active={{ transform: "translateY(0)" }}
        onClick={submitHandler}
        isLoading={loading}
        transition="all 0.2s ease"
      >
        Sign In to Workspace
      </Button>

      <Button
        variant="ghost"
        width="100%"
        py={5}
        borderRadius="14px"
        bg="rgba(239, 68, 68, 0.08)"
        border="1px solid rgba(239, 68, 68, 0.2)"
        color="#EF4444"
        fontWeight="600"
        fontSize="xs"
        _hover={{
          bg: "rgba(239, 68, 68, 0.15)",
          color: "#DC2626",
          border: "1px solid rgba(239, 68, 68, 0.35)",
        }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        transition="all 0.2s ease"
      >
        ⚡ Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
