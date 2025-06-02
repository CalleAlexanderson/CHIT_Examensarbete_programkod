import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AccountProvider } from './Context/AccountContext.tsx'
import { FriendProvider } from './Context/FriendsContext.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './Routing.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='color-primary top-div'></div>


    <AccountProvider>
      <FriendProvider>
        <RouterProvider router={router} />
      </FriendProvider>
    </AccountProvider>
  </StrictMode>,
)
