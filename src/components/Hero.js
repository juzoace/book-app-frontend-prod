import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Text,
  Container,
  Flex,
  Heading,
  Link,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  Spinner,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  getAllBooks,
  createBook,
  deleteBook as deleteBookService,
  updateBook as updateBookService,
} from "../services/graphqlService";

const Hero = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null); // Track the book to delete
  const [deleteItem, setDeleteItem] = useState(null)
  const [editBook, setEditBook] = useState(null); // Track the book to edit
  const [isEditBookOpen, setIsEditBookOpen] = useState(false); // Track edit modal state
  const [accessToken, setAccessToken] = useState('')

  const fetchBooks = async () => {
    const token = await getAccessTokenSilently();
    setAccessToken(token);
    try {
      const data = await getAllBooks(token);
      setBooks(data);
    } catch (error) {
      // Handle error
      console.error("Error fetching books:", error);
    }
  };

  const createNewBook = async () => {
    try {
      setIsLoading(true);
      await createBook(newBook.name, newBook.description, accessToken);
      await fetchBooks(); // Refresh the book list
      onClose(); // Close the modal
      setNewBook({ name: "", description: "" }); 
    } catch (error) {
      // Handle error
      console.error("Error creating a new book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      setIsLoading(true);
      await deleteBookService(id, accessToken);
      await fetchBooks(); // Refresh the book list
    } catch (error) {
      // Handle error
      console.error("Error deleting a book:", error);
    } finally {
      setIsLoading(false);
      setDeleteItemId(null); // Clear the deleteItemId
    }
  };

  const updateBook = async (id, updatedData) => {
    try {
      await updateBookService(id, updatedData, accessToken);
      await fetchBooks(); // Refresh the book list
      setEditBook(null); // Clear the editBook
    } catch (error) {
      // Handle error
      console.error("Error updating a book:", error);
    }
  };

  const openEditBook = (book) => {
    setEditBook({
      id: book.id,
      name: book.name,
      description: book.description,
    });
    setIsEditBookOpen(true);
  };

  const closeEditBook = () => {
    setIsEditBookOpen(false);
    setEditBook(null);
  };

  useEffect(() => {
    fetchBooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) {
    return (
      <div>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Text fontSize="xl">Login to the Book Application</Text>
          <Button
            id="qsLoginBtn"
            color="primary"
            className="btn-margin"
            style={{
              width: "150px",
            }}
            onClick={() => loginWithRedirect()}
          >
            Log in
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <Box width={"100%"} p={4}>
      <Stack spacing={4} as={Container} maxW={"3xl"}>
        <Text fontSize="xl">Book Application</Text>
        <Stack>
          <Flex>
            <Box>
              <Heading fontSize={"xl"}>Book List</Heading>
            </Box>
            <Spacer />
            <Box>
              <Button colorScheme={"blue"} onClick={onOpen}>
                Add Book
              </Button>
            </Box>
          </Flex>
        </Stack>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th width="100px">Name</Th>
                <Th width="100px">Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {books?.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td width="100px">{item.name}</Td>
                  <Td width="100px">{item.description}</Td>
                  <Td>
                    <Link
                      mr={2}
                      onClick={() => openEditBook(item)}
                    >
                      <Button colorScheme="green">Edit</Button>
                    </Link>
                    <Link
                      onClick={() => {
                        setDeleteItemId(item.id);
                        setDeleteItem(item)
                      }}
                    >
                      <Button colorScheme="red">Delete</Button>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Create Book Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  value={newBook.name}
                  onChange={(e) =>
                    setNewBook({ ...newBook, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Description"
                  value={newBook.description}
                  onChange={(e) =>
                    setNewBook({ ...newBook, description: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={createNewBook}
              isLoading={isLoading}
            >
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Book Modal */}
      {editBook && (
        <Modal isOpen={isEditBookOpen} onClose={closeEditBook}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Book</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Name"
                    value={editBook.name}
                    onChange={(e) =>
                      setEditBook({ ...editBook, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    placeholder="Description"
                    value={editBook.description}
                    onChange={(e) =>
                      setEditBook({ ...editBook, description: e.target.value })
                    }
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={() => {
                  // Call the updateBook function with the edited data
                  updateBook(editBook.id, {
                    name: editBook.name,
                    description: editBook.description,
                  });
                  closeEditBook(); // Close the edit modal
                }}
              >
                Save
              </Button>
              <Button onClick={closeEditBook}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete:   
           {deleteItem && (
              <Box as="span" m={1} p={1} fontWeight="bold" borderRadius="5px" backgroundColor="lightblue">
                {deleteItem.name}
              </Box>
           )}
            ?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteBook(deleteItemId);
                setDeleteItemId(null);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setDeleteItemId(null)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Hero;
