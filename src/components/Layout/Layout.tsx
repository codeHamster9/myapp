import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'

import Navbar from '../Navbar'
import { Spinner } from '../ui/loader'

import styles from './Layout.module.css'

const Loader = () => (
  <div className="h-full min-h-full flex items-center justify-center text-black">
    <Spinner size={'large'}>Loading...</Spinner>
  </div>
)

const Layout: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <main className={styles.layout} {...rest}>
      <Navbar />
      <div className={styles.container}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </div>
    </main>
  )
}

export default Layout
