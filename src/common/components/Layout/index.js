import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import './styles.css'

const Layout = (props) => (
    <div className="container">
        <div {...props}></div>
    </div>
)

export default Layout
