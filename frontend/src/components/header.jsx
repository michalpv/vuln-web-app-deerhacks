import React, { useContext } from 'react';
import { Box, Flex, Text, Button, HStack, Link } from '@chakra-ui/react';
import { UserContext } from "src/user-context";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    fetch('/api/logout', { method: 'GET' });
    navigate('/home');
  }

  return (
    <Box bg="white" px={4} py={3}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">Super-Secure Residences{user?.isAdmin && " (Admin)"}</Text>
        <HStack spacing={4}>
          <Link href="/home">Home</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <>
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
