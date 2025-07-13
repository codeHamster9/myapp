import type { PropsWithChildren } from 'react'
import React from 'react'

import Navbar from '../Navbar'

import styles from './Layout.module.css'

const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <main className={styles.layout} {...rest}>
      <Navbar />
      <div className={styles.container}>{children}</div>
    </main>
  )
}

export default Layout
