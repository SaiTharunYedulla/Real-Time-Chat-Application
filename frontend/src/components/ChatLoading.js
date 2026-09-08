import { Box, Stack, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack spacing={2.5}>
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          height="45px"
          borderRadius="14px"
          startColor="rgba(255, 255, 255, 0.05)"
          endColor="rgba(99, 102, 241, 0.18)"
        />
      ))}
    </Stack>
  );
};

export default ChatLoading;
