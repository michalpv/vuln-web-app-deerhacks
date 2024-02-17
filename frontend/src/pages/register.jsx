import React, { useState } from 'react';
import { Box, Flex, VStack, Input, Button, Heading, useToast } from '@chakra-ui/react';
import Header from 'src/components/header';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [user, setUser] = useState({
    email: '',
    name: '',
    roomNumber: '',
    password: '',
    confirmPassword: '',
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast({ title: "Passwords don't match", status: 'error', duration: 2000 });
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          roomNumber: user.roomNumber,
          password: user.password,
        }),
      });

      if (response.ok) {
        toast({ title: 'Registration successful', status: 'success', duration: 2000 });
        navigate('/login');
        
      } else {
        throw new Error('Failed to register');
      }
    } catch (error) {
      toast({ title: error.message, status: 'error', duration: 2000 });
    }
  };

  return (
    <Box>
      <Header />
      <form onSubmit={handleSubmit}>
        <Flex mt={4} flexDirection="column" justifyContent="center" alignItems="center">
          <VStack spacing={4} p={8} w="40%">
            <Heading>Register</Heading>
            <Input placeholder="Email" name="email" value={user.email} onChange={handleChange} />
            <Input placeholder="Name" name="name" value={user.name} onChange={handleChange} />
            <Input placeholder="Room #" name="roomNumber" value={user.roomNumber} onChange={handleChange} />
            <Input placeholder="Password" name="password" type="password" value={user.password} onChange={handleChange} />
            <Input placeholder="Confirm Password" name="confirmPassword" type="password" value={user.confirmPassword} onChange={handleChange} />
            <Button colorScheme="blue" type="submit">Sign up</Button>
          </VStack>
        </Flex>
      </form>
    </Box>
  );
};

export default RegisterPage;
