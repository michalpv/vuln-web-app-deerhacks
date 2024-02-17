import React, { useState, useContext } from 'react';
import { Box, Flex, VStack, Input, Button, Heading, useToast } from '@chakra-ui/react';
import Header from 'src/components/header';
import { useNavigate } from 'react-router-dom';
import { UserContext } from 'src/user-context';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        navigate('/dashboard');
      } else {
        const error = await response.text();
        toast({
          title: error || 'Failed to log in',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: error.toString(),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Header />
      <form onSubmit={handleLogin}>
        <Flex mt={4} flexDirection="column" justifyContent="center" alignItems="center">
          <VStack spacing={4} p={8} w="40%">
            <Heading>Login</Heading>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button colorScheme="blue" type="submit">Log In</Button>
          </VStack>
        </Flex>
      </form>
    </Box>
  );
};

export default LoginPage;
