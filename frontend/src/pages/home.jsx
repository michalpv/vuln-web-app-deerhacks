import React from 'react';
import {
  Box, 
  Flex, 
  Text, 
  Button, 
  VStack, 
  HStack, 
  Heading,
  Image,
  Link
} from '@chakra-ui/react';
import Header from 'src/components/header';

const HomePage = () => {
  return (
    <>
      <Header />
      <VStack spacing={8} p={8} align="stretch">
        <Box bg="white" p={8} shadow="md">
          <Heading>Welcome to Super-Secure Residences</Heading>
          <Text mt={4}>Experience the pinnacle of secure, smart living.</Text>
        </Box>

        <Flex direction={{ base: 'column', md: 'row' }} spacing={8}>
          <Box flex={1} bg="white" p={6} shadow="md">
            <Heading size="md">Advanced Security</Heading>
            <Text mt={2}>State-of-the-art smart home systems to ensure your safety and security.</Text>
          </Box>

          <Box flex={1} bg="white" p={6} shadow="md">
            <Heading size="md">Smart Living</Heading>
            <Text mt={2}>Control every aspect of your home environment with our intuitive online interface.</Text>
          </Box>

          <Box flex={1} bg="white" p={6} shadow="md">
            <Heading size="md">Convenience</Heading>
            <Text mt={2}>Download your invoices through our secure portal.</Text>
          </Box>
        </Flex>
        
        <Box bg="white" p={8} shadow="md">
          <Heading>Contact Us</Heading>
          <Text mt={4}>Have questions or need support? Our team is here to help.</Text>
        </Box>
      </VStack>
    </>
  );
}

export default HomePage;
