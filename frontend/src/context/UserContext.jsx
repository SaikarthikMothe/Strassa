import React, { createContext, useState, useEffect } from 'react'

export const UserDataContext = createContext()

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null)

  // 🔑 Restore user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext
