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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon color="#94A3B8" />}
          onClick={onOpen}
          variant="ghost"
          borderRadius="full"
          _hover={{ bg: "rgba(255, 255, 255, 0.1)", color: "#F8FAFC" }}
        />
      )}
      <Modal size="md" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(12px)" bg="rgba(0, 0, 0, 0.7)" />
        <ModalContent
          bg="rgba(15, 23, 42, 0.95)"
          border="1px solid rgba(255, 255, 255, 0.12)"
          borderRadius="24px"
          color="#F8FAFC"
          boxShadow="0 30px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.2)"
          py={4}
        >
          <ModalHeader
            fontSize="2xl"
            fontWeight="800"
            display="flex"
            justifyContent="center"
            className="gradient-text"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton color="#94A3B8" borderRadius="full" />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap={5}
            py={4}
          >
            <Image
              borderRadius="full"
              boxSize="130px"
              src={user.pic}
              alt={user.name}
              border="3px solid #6366F1"
              boxShadow="0 0 25px rgba(99, 102, 241, 0.4)"
            />
            <Text
              fontSize="sm"
              color="#CBD5E1"
              bg="rgba(255, 255, 255, 0.05)"
              px={4}
              py={2}
              borderRadius="full"
              border="1px solid rgba(255, 255, 255, 0.08)"
            >
              ✉️ {user.email}
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              onClick={onClose}
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.1)"
              color="#F8FAFC"
              px={8}
              _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
