import React from 'react'
import { Route } from 'react-router'

import SignIn from 'src/common/components/SignIn'
import Layout from 'src/common/components/Layout'

export default (
    <Route components={Layout}>
        <Route path="/" component={SignIn} />
    </Route>
)
