import './App.css'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [show, setShow] = useState(true)
  const [cart, setCart] = useState([])

  const handleClick = (product) => {
    let isPresent = false
    cart.forEach((item) => {
      if (product._id === item._id) isPresent = true
    })
    if (isPresent) return
    setCart([...cart, product])
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet /> {/* React Router will render child routes here */}
      </div>
      <MyFooter />
    </>
  )
}

export default App