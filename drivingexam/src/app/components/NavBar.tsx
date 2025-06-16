import Link from 'next/link'
import styles from './NavBar.module.css'

export default function NavBar() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}>🚗 Führerschein App</Link>
      <nav>
        <Link href="/modules" className={styles.link}>Module</Link>
      </nav>
    </header>
  )
}
