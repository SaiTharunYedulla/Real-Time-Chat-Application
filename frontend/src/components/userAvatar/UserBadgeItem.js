import { Box, CloseButton } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="full"
      m={1}
      fontSize={11}
      fontWeight="600"
      bg="linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)"
      border="1px solid rgba(99, 102, 241, 0.5)"
      color="#E2E8F0"
      cursor="pointer"
      onClick={handleFunction}
      display="inline-flex"
      alignItems="center"
      gap={1}
      _hover={{
        bg: "rgba(239, 68, 68, 0.25)",
        borderColor: "rgba(239, 68, 68, 0.5)",
        color: "#FCA5A5",
      }}
      transition="all 0.2s ease"
    >
      {user.name}
      {admin === user._id && <span style={{ color: "#F59E0B" }}> (Admin)</span>}
      <CloseButton size="xs" pl={1} color="currentColor" />
    </Box>
  );
};

export default UserBadgeItem;
