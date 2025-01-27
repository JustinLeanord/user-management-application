import React, {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  })
  const [error, setError] = useState(null)

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      )
      setUsers(response.data)
    } catch (err) {
      setError('Failed to fetch users. Please try again later.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle form input changes
  const handleInputChange = e => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  // Handle user addition
  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/users',
        formData,
      )
      setUsers([...users, response.data])
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
      })
    } catch (err) {
      setError('Failed to add user. Please try again.')
    }
  }

  // Handle user editing
  const handleEditUser = async () => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${selectedUser.id}`,
        formData,
      )
      setUsers(
        users.map(user => (user.id === selectedUser.id ? response.data : user)),
      )
      setSelectedUser(null)
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
      })
    } catch (err) {
      setError('Failed to edit user. Please try again.')
    }
  }

  // Handle user deletion
  const handleDeleteUser = async id => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      setError('Failed to delete user. Please try again.')
    }
  }

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>
        User Management
      </h1>

      {error && <p style={{color: 'red', marginBottom: '16px'}}>{error}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {users.map(user => (
          <div
            key={user.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Department:</strong> {user.department || 'N/A'}
            </p>
            <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
              <button
                onClick={() => {
                  setSelectedUser(user)
                  setFormData(user)
                }}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: '#DC3545',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        style={{
          marginTop: '16px',
          padding: '10px 16px',
          border: 'none',
          backgroundColor: '#28A745',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add User
      </button>

      {selectedUser !== null && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{fontSize: '20px', marginBottom: '16px'}}>
            {selectedUser ? 'Edit User' : 'Add User'}
          </h2>
          <form
            onSubmit={e => {
              e.preventDefault()
              selectedUser ? handleEditUser() : handleAddUser()
            }}
          >
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <input
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleInputChange}
                required
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <input
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleInputChange}
                required
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <input
                name='email'
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <input
                name='department'
                placeholder='Department'
                value={formData.department}
                onChange={handleInputChange}
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>
            <button
              type='submit'
              style={{
                marginTop: '16px',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: '#007BFF',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {selectedUser ? 'Update' : 'Add'} User
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
