import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="rgba(255, 255, 255, 0.04)"
      border="1px solid rgba(255, 255, 255, 0.06)"
      _hover={{
        background: "rgba(99, 102, 241, 0.25)",
        borderColor: "rgba(99, 102, 241, 0.4)",
        transform: "translateX(2px)",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="#F8FAFC"
      px={3}
      py={2.5}
      mb={2}
      borderRadius="14px"
      transition="all 0.2s ease"
    >
      <Avatar
        mr={3}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        border="1px solid #6366F1"
      />
      <Box>
        <Text fontWeight="600" fontSize="xs" color="#F1F5F9">
          {user.name}
        </Text>
        <Text fontSize="10px" color="#94A3B8">
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
