import React, { useContext } from 'react';
import { Box, Heading, Text, CircularProgress, CircularProgressLabel, Flex, VStack, Spacer } from '@chakra-ui/react';
import Header from 'src/components/header';
import { UserContext } from "src/user-context";

const DashboardPage = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  const handleInvoiceClick = (invoiceName) => {
    fetch(`/api/invoice?invoiceName=${invoiceName}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = invoiceName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => console.error('Error fetching invoice:', err));
  };

  return (
    <>
      <Header />
      <VStack spacing={8} p={8} align="stretch">
        <Box flex={1} bg="white" p={6} shadow="md">
          {
            user.isAdmin ?
              <Heading>Admin Dashboard</Heading>
              :
              <Heading>Dashboard</Heading>
          }
          <Text mt={4}>Welcome to your dashboard{user.isAdmin && ", administrator"}!</Text>
        </Box>

        <Box flex={1} bg="white" p={6} shadow="md">
          <Flex mt={4} justifyContent="space-around">
            <Box textAlign="center">
              <Heading size="md">Temperature</Heading>
              <CircularProgress value={user.temperature} color="orange.400" size="100px" thickness="8px">
                <CircularProgressLabel>{user.temperature}°C</CircularProgressLabel>
              </CircularProgress>
            </Box>
            <Box textAlign="center">
              <Heading size="md">Humidity</Heading>
              <CircularProgress value={user.humidity} color="blue.400" size="100px" thickness="8px">
                <CircularProgressLabel>{user.humidity}%</CircularProgressLabel>
              </CircularProgress>
            </Box>
          </Flex>
          <Flex mt={4} justifyContent="center">
            <Box textAlign="center">
              <Heading size="md">Room Number: #{user.roomNumber}</Heading>
              <Heading size="md">Email address: {user.email}</Heading>
            </Box>
          </Flex>
        </Box>

        <Box flex={1} bg="white" p={6} shadow="md">
          <Heading size="md">Invoices</Heading>
          <Text mt={4}>Download your invoices through our secure portal.</Text>
          <Flex mt={4} justifyContent="space-around">
            {user?.invoices ?
              user.invoices.map((invoice, index) => (
                <Box key={index} textAlign="center" bg="gray.100" p={4} cursor="pointer" onClick={() => handleInvoiceClick(invoice.invoiceName)}>
                  <Heading size="md">{invoice.invoiceName}</Heading>
                  <Text mt={2}>Date: {invoice.date}</Text>
                  <Text mt={2}>Amount: ${invoice.amount}</Text>
                </Box>
              ))
              :
              <Text>No invoices available</Text>
            }
          </Flex>
        </Box>
      </VStack>
    </>
  );
};

export default DashboardPage;
