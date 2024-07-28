'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import navStyles from '../app/nav.module.css';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`${navStyles.navLink} ${isActive ? navStyles.active : ''}`}
    >
      {children}
    </Link>
  );
}