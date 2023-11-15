import axios from "axios";


const graphqlEndpoint = `https://book-api-auth0-e4ad716ccb6a.herokuapp.com/graphql`;
console.log(graphqlEndpoint)

export const getAllBooks = async (token) => {
  
  const accessToken = token;
  console.log(accessToken);
  
  try {
    
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
          query {
            getAllBooks {
              id
              name
              description
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data.data.getAllBooks)

    return response.data.data.getAllBooks;
  } catch (error) {
    console.error('GraphQL Error:', error.response.data.message);
    throw error;
  }
};

export const createBook = async (name, description, token) => {
  const accessToken = token;
  console.log(accessToken);
    try {
      const response = await axios.post(
        graphqlEndpoint,
        {
          query: `
            mutation ($name: String!, $description: String!) {
              createBook(input: { name: $name, description: $description }) {
                id
                name
                description
              }
            }
          `,
          variables: {
            name,
            description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      return response.data.data.createBook;
    } catch (error) {
      console.error('GraphQL Error:', error.response.data.message);
      throw error;
    }
};

export const updateBook = async (id, updatedData, token) => {
  const accessToken = token;
  
  try {
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
          mutation ($id: ID!, $input: BookInput!) {
            updateBook(id: $id, input: $input) {
              id
              name
              description
            }
          }
        `,
        variables: {
          id,
          input: updatedData,
          // description,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('GraphQL Response:', response.data.data);

    return response.data.data.updateBook;
  } catch (error) {
    console.error('GraphQL Error:', error.response ? error.response.data.message : error.message);
    throw error;
  }
};

export const deleteBook = async (id, token) => {
  const accessToken = token;
    try {
      const response = await axios.post(
        graphqlEndpoint,
        {
          query: `
            mutation ($id: ID!) {
              deleteBook(id: $id)
            }
          `,
          variables: {
            id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      return response.data.data.deleteBook;
    } catch (error) {
      console.error('GraphQL Error:', error.response.data.message);
      throw error;
    }
};
  
  