import './style.css'
import ReactDOM from 'react-dom/client'
//import App from './App'
import Header from './Containers/Header.jsx'
import React from 'react'
import { Suspense } from 'react'



const root = ReactDOM.createRoot(document.querySelector('#root'))
const App = React.lazy(() => import('./App.jsx'))

root.render(
    <>
        <div className='header'>
            <Header />
        </div>
        <div className='appArea'>
            <Suspense fallback={<div>Loading App...</div>}>
                <App />
            </Suspense>
        </div>
    </>
)